const fs = require('fs');
const cheerio = require('cheerio');

module.exports.getJobInfoFromLeverApplications = async () => {
  const files = fs.readdirSync('./data/applications/lever');
  files.forEach((file) => {
    const content = fs.readFileSync(`./data/applications/lever/${file}`);
    const $ = cheerio.load(content);

    const jobTitle = $('.posting-headline h2').text();

    const location = $('.location').text();
    const department = $('.department').text().trim(); // Using trim() to clean up any extra whitespace
    const commitment = $('.commitment').text();
    const workplaceType = $('.workplaceTypes').text().trim(); // Assuming the structure you provided, and trimming

    console.log(`Posting Heading: ${jobTitle}`);
    console.log(`Location: ${location}`);
    console.log(`Department: ${department}`);
    console.log(`Commitment: ${commitment}`);
    console.log(`Workplace Type: ${workplaceType}`);

    // Need to get all application text for embedding

    const applicationDivs = $('.section-wrapper.page-full-width > div');

    applicationDivs.each(function () {
      // Extract and process the text of each div
      const text = $(this).text().trim();
      console.log(text);
    });
  });
};

const main = () => {
  this.getJobInfoFromLeverApplications();
};

main();
