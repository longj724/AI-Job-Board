// External Dependencies
import axios from 'axios';
import fs from 'fs';
import cheerio from 'cheerio';

const getCanaanPage = async (): Promise<void> => {
  try {
    const res = await axios.get('https://www.canaan.com/companies');
    fs.writeFile('./activeData/firms/Canaan.txt', res.data, (err: any) => err);
  } catch (err: any) {
    console.log(err);
    return err;
  }
};

const parseCompaniesFromCanaanPage = async (): Promise<void> => {
  let companies: string[] = [];
  const data = await fs.promises.readFile(
    './activeData/firms/Canaan.txt',
    'utf-8'
  );
  const $ = cheerio.load(data);

  const container = $('a.list-item');

  container.each((_, element) => {
    companies.push($(element).find('p').text().trim());
  });

  fs.writeFileSync(
    './activeData/companies/Canaan.txt',
    companies.join('\n'),
    'utf-8'
  );
};

const main = async (fetchCanaanPage: boolean): Promise<void> => {
  if (fetchCanaanPage) {
    await getCanaanPage();
  }
  await parseCompaniesFromCanaanPage();
};

main(true);
