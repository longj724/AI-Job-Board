const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const { writeDataToFile } = require('../utils/fileOperations');

const getAccelPage = async () => {
  axios
    .get('https://jobs.accel.com/')
    .then((res) => {
      writeDataToFile('../data/firms/accel.txt', res.data);
    })
    .catch((err) => {
      return err;
    });
};

const getCompaniesFromAccel = async () => {
  let compList = [];
  const data = await fs.promises.readFile('../data/firms/accel.txt');
  const $ = cheerio.load(data);

  const divs = $('.company_text');

  divs.each((_, element) => {
    compList.push($(element).find('h5').first().text());
  });
  return compList;
};

const getCompanies = async (getAccelCompanies) => {
  let companies = [];
  if (getAccelCompanies) {
    companies = await getCompaniesFromAccel();
  }

  let companiesForFile = companies.join('\n');
  fs.writeFileSync('./data/companies/accel.txt', companiesForFile, 'utf-8');
};

const main = async (getAccelPortfolio, getAccelCompanies) => {
  if (getAccelPortfolio) {
    await getAccelPage();
  }
  getCompanies(getAccelCompanies);
};

main(false, true);
