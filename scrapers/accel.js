const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const { writeDataToFile } = require('../utils/fileOperations');
const { getJobData } = require('./getJobData');

const getAccelPage = async () => {
  axios
    .get('https://jobs.accel.com/')
    .then((res) => {
      const result = writeDataToFile('./data/firms/accel.txt', res.data);
    })
    .catch((err) => {
      return err;
    });
};

const getCompaniesFromAccel = async () => {
  let compList = [];
  const data = await fs.promises.readFile('./data/firms/accel.txt');
  const $ = cheerio.load(data);

  const divs = $('.company_text');

  divs.each((_, element) => {
    compList.push($(element).find('h5').first().text());
  });
  return compList;
};

const getJobs = async () => {
  let companies = await getCompaniesFromAccel();
  companies.forEach((name) => {
    getJobData(name, 'Accel');
  });
};

const main = async () => {
  await getAccelPage();
  getJobs();
};

main();
