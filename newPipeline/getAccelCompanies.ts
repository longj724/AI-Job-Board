// External Dependencies
import axios from 'axios';
import fs from 'fs';
import cheerio from 'cheerio';

const getAccelPage = async (): Promise<void> => {
  try {
    const res = await axios.get('https://jobs.accel.com/');
    fs.writeFile('../data/firms/accel.txt', res.data, (err: any) => err);
  } catch (err: any) {
    return err;
  }
};

const getCompaniesFromAccel = async (): Promise<string[]> => {
  let compList: string[] = [];
  const data = await fs.promises.readFile('../data/firms/accel.txt', 'utf-8');
  const $ = cheerio.load(data);

  const divs = $('.company_text');

  divs.each((_, element) => {
    compList.push($(element).find('h5').first().text());
  });
  return compList;
};

const getCompanies = async (getAccelCompanies: boolean): Promise<void> => {
  let companies: string[] = [];
  if (getAccelCompanies) {
    companies = await getCompaniesFromAccel();
  }

  let companiesForFile = companies.join('\n');
  fs.writeFileSync('./data/companies/accel.txt', companiesForFile, 'utf-8');
};

const main = async (
  getAccelPortfolio: boolean,
  getAccelCompanies: boolean
): Promise<void> => {
  if (getAccelPortfolio) {
    await getAccelPage();
  }
  await getCompanies(getAccelCompanies);
};

main(false, true);
