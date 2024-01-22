const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

// This will read through all job boards and get applications
module.exports.getJobApplicationsFromLever = async () => {
  try {
    const files = fs.readdirSync('./data/boards/lever');
    files.forEach((file) => {
      const content = fs.readFileSync(`./data/boards/lever/${file}`);
      const $ = cheerio.load(content);

      const applicationHrefs = [];

      $('a.posting-title').each((_, element) => {
        const href = $(element).attr('href');
        applicationHrefs.push(href);
      });

      applicationHrefs.forEach((url, index) => {
        axios.get(url).then((res) => {
          // Want to just save the application to read from later
          fs.writeFile(
            `./data/applications/lever/${file.replace(
              /(\.txt)$/,
              `-${index}$1`
            )}`,
            res.data,
            (err) => {
              console.log(err);
            }
          );
        });
      });
    });
  } catch (err) {
    console.error('Error reading directory:', err);
  }
};

const main = () => {
  this.getJobApplicationsFromLever();
};

main();
