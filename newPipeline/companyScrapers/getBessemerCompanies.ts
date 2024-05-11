// External Dependencies
import axios from 'axios';
import fs from 'fs';
import cheerio from 'cheerio';

const getBessemerPage = async (): Promise<void> => {
  try {
    const res = await axios.get('https://www.bvp.com/companies');
    fs.writeFile(
      './activeData/firms/Bessemer.txt',
      res.data,
      (err: any) => err
    );
  } catch (err: any) {
    console.log(err);
    return err;
  }
};

const parseCompaniesFromBessemerPage = async (): Promise<void> => {
  let companies: string[] = [];
  const data = await fs.promises.readFile(
    './activeData/firms/Bessemer.txt',
    'utf-8'
  );
  const $ = cheerio.load(data);

  const divs = $('a.name.click-to-open');

  divs.each((_, element) => {
    companies.push($(element).text().trim());
  });

  fs.writeFileSync(
    './activeData/companies/Bessemer.txt',
    companies.join('\n'),
    'utf-8'
  );
};

const main = async (fetchBessemerPage: boolean): Promise<void> => {
  if (fetchBessemerPage) {
    await getBessemerPage();
  }
  await parseCompaniesFromBessemerPage();
};

main(true);
