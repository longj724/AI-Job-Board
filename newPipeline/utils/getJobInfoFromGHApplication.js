// External Dependencies
const fs = require('fs');
const cheerio = require('cheerio');
const { supabaseClient } = require('./supabaseClient');
const openAI = require('./openAIClient');
const dotenv = require('dotenv');
dotenv.config();

module.exports.getJobInfoFromGreenhouseApplications = async () => {
  const files = fs.readdirSync('./data/applications/gh');
  files.forEach(async (file) => {
    const content = fs.readFileSync(`./data/applications/gh/${file}`);
    const $ = cheerio.load(content);

    const companyName = $('.company-name').text().replace('at', '').trim();
    const jobTitle = $('.app-title').text();
    const location = $('.location').text();

    const applicationDivs = $('#content > div');

    let applicationText = '';
    applicationDivs.each(function () {
      const text = $(this).text().trim();
      applicationText += text;
    });

    // Put application into db
    if (companyName != '' && jobTitle != '' && applicationText != '') {
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

      const embeddingResponse = await openAI.embeddings.create({
        model: 'text-embedding-ada-002',
        input: applicationText,
      });

      const [responseData] = embeddingResponse.data;

      const { data, error } = await supabase
        .from('Application_Embeddings')
        .insert({
          application_id: applicationData[0].id,
          embedding: responseData.embedding,
          token_count: embeddingResponse.usage.total_tokens,
        })
        .select('*');
    }
  });
};

const main = () => {
  this.getJobInfoFromGreenhouseApplications();
};

main();
