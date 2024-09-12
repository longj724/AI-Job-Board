const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const { writeDataToFile } = require('../utils/fileOperations');
const { getJobData } = require('./getJobData');

const geta16zPage = async () => {
  axios
    .get('https://a16z.com/portfolio')
    .then((res) => {
      const result = writeDataToFile('../data/firms/a16z.txt', res.data);
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

const getCompaniesFroma16z = async (filePath) => {
  const data = await fs.promises.readFile(filePath);

  const $ = cheerio.load(data);

  const divs = $('.company__thumbnail');

  let companyUrls = [];
  divs.each((_, element) => {
    companyUrls.push($(element).find('a').attr('href'));
  });

  const companyNames = companyUrls
    .filter((url) => url !== undefined)
    .map((url) => {
      let domain = new URL(url);
      let hostname = domain.host;
      let split = hostname.split('.');
      console.log(split[split.length - 2]);
      return split[split.length - 2];
    });

  return companyNames;
};

const getJobs = async () => {
  let companies = await getCompaniesFroma16z('../data/firms/a16z.txt');

  companies.forEach((name) => {
    getJobData(name, 'a16z');
  });
};

const main = async () => {
  // await geta16zPage();
  getJobs();
};

main();

// jobs.lever.com/companyname
// Get div class = posting

// boards.greenhouse.io/companyname
// Get div class = opening
