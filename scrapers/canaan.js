const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const { writeDataToFile } = require('../utils/fileOperations');
const { getJobData } = require('./getJobData');

const getCanaanPage = async () => {
  axios.get('https://www.canaan.com/companies').then((res) => {
    const result = writeDataToFile('./data/firms/canaan.txt', res.data);
  });
};

const getCompaniesFromCanaan = async () => {
  let compList = [];
  const data = await fs.promises.readFile('./data/firms/canaan.txt');
  const $ = cheerio.load(data);

  const divs = $('.company-status--current');

  divs.each((_, element) => {
    compList.push($(element).first('p').text().trim().split('\n')[0]);
  });
  return compList;
};

const getJobs = async () => {
  let companies = await getCompaniesFromCanaan();
  companies.forEach((name) => {
    getJobData(name, 'Canaan');
  });
};

const main = async () => {
  await getCanaanPage();
  getJobs();
};

main();
