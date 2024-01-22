const fs = require('fs');
const cheerio = require('cheerio');

module.exports.getJobInfoFromGreenhouseApplications = async () => {
  const files = fs.readdirSync('./data/applications/gh');
  files.forEach((file) => {
    const content = fs.readFileSync(`./data/applications/gh/${file}`);
    const $ = cheerio.load(content);

    const companyName = $('.company-name').text().replace('at', '').trim();
    const jobTitle = $('.app-title').text();
    const location = $('.location').text();

    console.log('companyName', companyName);
    console.log('jobtitle', jobTitle);
    console.log('location', location);

    const applicationInfo = $('#content > div');

    const applicationText = '';
    applicationInfo.each(function () {
      // Extract and process the text of each div
      const text = $(this).text().trim();
      console.log(text);
      applicationInfo += text;
      applicationInfo += '\n';
    });
  });
};

const main = () => {
  this.getJobInfoFromGreenhouseApplications();
};

main();
