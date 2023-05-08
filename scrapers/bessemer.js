const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const { writeDataToFile } = require('../utils/fileOperations');
const { getJobData } = require('./getJobData');

const getBessemerPage = async () => {
  axios.get('https://www.bvp.com/companies').then((res) => {
    writeDataToFile('./data/firms/bessemer.txt', res.data);
  });
};

const getCompaniesFromBessemer = async (filePath) => {
  const data = await fs.promises.readFile(filePath);

  const $ = cheerio.load(data);
  const divs = $('.name');

  let companyList = [];
  divs.each((_, element) => {
    const companyName = $(element).first().text().slice(0, -1);
    console.log(companyName);
    companyList.push(companyName);
  });

  return companyList;
};

const getJobs = async () => {
  let companies = await getCompaniesFromBessemer('./data/firms/bessemer.txt');

  companies.forEach((name) => {
    getJobData(name, 'Bessemer');
  });
};

const main = async () => {
  await getBessemerPage();
  getJobs();
};

main();
