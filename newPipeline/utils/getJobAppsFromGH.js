const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');

// This will read through all job boards and get applications
module.exports.getJobApplicationsFromGreenhouse = async () => {
  try {
    const files = fs.readdirSync('./data/boards/gh');
    files.forEach((file) => {
      const content = fs.readFileSync(`./data/boards/gh/${file}`);
      const $ = cheerio.load(content);

      const applicationHrefs = [];

      $('.opening a').each((_, element) => {
        const href = $(element).attr('href');
        applicationHrefs.push(href);
      });

      applicationHrefs.forEach((url, index) => {
        axios.get(`https://boards.greenhouse.io${url}`).then((res) => {
          // Want to just save the application
          // Can read from it later
          fs.writeFile(
            `./data/applications/gh/${file.replace(/(\.txt)$/, `-${index}$1`)}`,
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
  this.getJobApplicationsFromGreenhouse();
};

main();
