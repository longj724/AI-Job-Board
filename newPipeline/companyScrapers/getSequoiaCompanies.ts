// External Dependencies
import axios from 'axios';
import fs from 'fs';
import cheerio from 'cheerio';

const getSequoiaPage = async (): Promise<void> => {
  try {
    // Need to click "Load More" button
    const res = await axios.get(
      'https://www.sequoiacap.com/our-companies/#all-panel'
    );
    fs.writeFile('./data/firms/Sequoia.txt', res.data, (err: any) => err);
  } catch (err: any) {
    console.log(err);
    return err;
  }
};

const parseCompaniesFromSequoiaPage = async (): Promise<void> => {
  let companies: string[] = [];
  const data = await fs.promises.readFile('./data/firms/Sequoia.txt', 'utf-8');
  const $ = cheerio.load(data);

  const container = $('.company-listing__cell-wide.company-listing__head');

  container.each((_, element) => {
    companies.push($(element).text().trim());
  });

  fs.writeFileSync(
    './data/companies/Sequoia.txt',
    companies.join('\n'),
    'utf-8'
  );
};

const main = async (fetchSequoiaPage: boolean): Promise<void> => {
  if (fetchSequoiaPage) {
    await getSequoiaPage();
  }
  await parseCompaniesFromSequoiaPage();
};

main(true);
