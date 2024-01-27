// External Dependencies
const fs = require('fs');
const cheerio = require('cheerio');
const { supabaseClient } = require('./supabaseClient');
const openAI = require('./openAIClient');
const dotenv = require('dotenv');
dotenv.config();

module.exports.getJobInfoFromGreenhouseApplications = async () => {
  let numEmbeddingCalls = 0;
  let startTime = Date.now();
  const files = fs.readdirSync('./data/applications/gh');
  files.forEach(async (file) => {
    const content = fs.readFileSync(`./data/applications/gh/${file}`);
    const $ = cheerio.load(content);

    const companyName = $('.company-name').text().replace('at', '').trim();
    const jobTitle = $('.app-title').text();
    const location = $('.location').text();

    const applicationDivs = $('#content p, #content span, #content ul');

    let applicationText = '';
    let applicationChunks = [];
    applicationDivs.each(function () {
      const text = $(this).text().trim();
      applicationText += text;
      if (text.split(' ').length > 7) {
        applicationChunks.push(text);
      }
    });

    // Put application into db
    if (companyName != '' && jobTitle != '' && applicationChunks.length > 0) {
      const supabase = supabaseClient();
      const { data: applicationData, error: appError } = await supabase
        .from('Applications')
        .insert({
          company: companyName,
          title: jobTitle.trim(),
          location: location,
          content: applicationText,
        })
        .select('*');
      console.log('appData is', applicationData);
      console.log('chunks are', applicationChunks);

      if (applicationData !== null) {
        for (const chunk of applicationChunks) {
          if (numEmbeddingCalls >= 3000) {
            const now = Date.now();
            const timePassed = now - startTime;
            if (timePassed < 60000) {
              console.log(
                `Limit reached. Waiting for ${60000 - timePassed}ms.`
              );
              await new Promise((resolve) =>
                setTimeout(resolve, 60000 - timePassed)
              );
            }
            numEmbeddingCalls = 0;
            startTime = Date.now();
          }

          const embeddingResponse = await openAI.embeddings.create({
            model: 'text-embedding-ada-002',
            input: chunk,
          });
          numEmbeddingCalls += 1;

          const [responseData] = embeddingResponse.data;
          const { data, error } = await supabase
            .from('Application_Embeddings')
            .insert({
              application_id: applicationData[0].id,
              embedding: responseData.embedding,
              token_count: embeddingResponse.usage.total_tokens,
              content: applicationText,
            })
            .select('*');
        }
      }
    }
  });
};

const main = () => {
  this.getJobInfoFromGreenhouseApplications();
};

main();
