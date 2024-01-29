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

const parseCompaniesFromAccelPage = async (): Promise<void> => {
  let companies: string[] = [];
  const data = await fs.promises.readFile('../data/firms/accel.txt', 'utf-8');
  const $ = cheerio.load(data);

  const divs = $('.company_text');

  divs.each((_, element) => {
    companies.push($(element).find('h5').first().text());
  });

  fs.writeFileSync('./data/companies/accel.txt', companies.join('\n'), 'utf-8');
};

const main = async (fetchAccelPage: boolean): Promise<void> => {
  if (fetchAccelPage) {
    await getAccelPage();
  }
  await parseCompaniesFromAccelPage();
};

main(false);
