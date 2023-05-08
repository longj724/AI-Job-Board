const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const { writeDataToFile } = require('../utils/fileOperations');
const { getJobData } = require('./getJobData');

const getGreycroftPage = async () => {
  axios
    .get('https://www.greycroft.com/companies/')
    .then((res) => {
      const result = writeDataToFile('./data/firms/greycroft.txt', res.data);
    })
    .catch((err) => err);
};

const getCompaniesFromGreycroft = async () => {
  let compList = [];
  const data = await fs.promises.readFile('./data/firms/greycroft.txt');
  const $ = cheerio.load(data);

  const names = $('.company-tile__name');
  names.each((_, element) => {
    console.log($(element).text());
    compList.push($(element).text());
  });
  return compList;
};

const getJobs = async () => {
  let companies = await getCompaniesFromGreycroft();
  companies.forEach((name) => {
    getJobData(name, 'Greycroft');
  });
};

const main = async () => {
  await getGreycroftPage();
  getJobs();
};

main();
