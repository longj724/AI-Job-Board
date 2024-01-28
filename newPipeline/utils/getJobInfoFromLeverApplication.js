// External Dependencies
const fs = require('fs');
const cheerio = require('cheerio');
const { supabaseClient } = require('./supabaseClient');
const openAI = require('./openAIClient');
const dotenv = require('dotenv');
dotenv.config();

module.exports.getJobInfoFromLeverApplications = async () => {
  let numEmbeddingCalls = 0;
  let startTime = Date.now();
  const files = fs.readdirSync('./data/applications/lever');
  files.forEach(async (file) => {
    const content = fs.readFileSync(`./data/applications/lever/${file}`);
    const $ = cheerio.load(content);

    const companyName = file.split('-')[0];
    const jobTitle = $('.posting-headline h2').text();
    const location = $('.location').text();

    console.log(companyName);
    console.log(jobTitle);
    console.log(location);

    // Lever-only. May not use
    const department = $('.department').text().trim();
    const commitment = $('.commitment').text();
    const workplaceType = $('.workplaceTypes').text().trim();

    const applicationDivs = $('.section-wrapper.page-full-width > div');

    let applicationText = '';
    let applicationChunks = [];
    applicationDivs.each(function () {
      const text = $(this).text().trim();
      applicationText += text;
      if (text.split(' ').length > 7) {
        applicationChunks.push(text);
      }
    });

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

      if (applicationData !== null) {
        for (const chunk of applicationChunks) {
          if (numEmbeddingCalls >= 3000) {
            const now = Date.now();
            const timePassed = now - startTime;
            if (timePassed < 60000) {
              // Less than 1 minute has passed
              console.log(
                `Limit reached. Waiting for ${60000 - timePassed}ms.`
              );
              await new Promise((resolve) =>
                setTimeout(resolve, 60000 - timePassed)
              );
            }
            // Reset counter and startTime for a new window
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
          console.log('chunk is', chunk);
          console.log('embedding is', data);
          console.log('**********');
        }
      }
    }
  });
};

const main = () => {
  this.getJobInfoFromLeverApplications();
};

main();
