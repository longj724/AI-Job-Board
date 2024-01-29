// External Dependencies
import axios from 'axios';
import fs from 'fs';
import cheerio from 'cheerio';

const getGreycroftPage = async (): Promise<void> => {
  try {
    const res = await axios.get('https://www.greycroft.com/companies/');
    fs.writeFile('./data/firms/Greycroft.txt', res.data, (err: any) => err);
  } catch (err: any) {
    console.log(err);
    return err;
  }
};

const parseCompaniesFromGreycroftPage = async (): Promise<void> => {
  let companies: string[] = [];
  const data = await fs.promises.readFile(
    './data/firms/Greycroft.txt',
    'utf-8'
  );
  const $ = cheerio.load(data);

  const container = $('.company-tile__content');

  container.each((_, element) => {
    companies.push($(element).find('p.company-tile__name').text().trim());
  });

  fs.writeFileSync(
    './data/companies/Greycroft.txt',
    companies.join('\n'),
    'utf-8'
  );
};

const main = async (fetchGreycroftPage: boolean): Promise<void> => {
  if (fetchGreycroftPage) {
    await getGreycroftPage();
  }
  await parseCompaniesFromGreycroftPage();
};

main(true);
