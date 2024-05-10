// External Dependencies
import fs from 'fs';
import cheerio from 'cheerio';
import axios from 'axios';

export const getJobApplicationsFromGreenhouse = async (): Promise<void> => {
  try {
    const files = fs.readdirSync('./data/boards/gh');
    for (const file of files) {
      const content = fs.readFileSync(`./data/boards/gh/${file}`, 'utf-8');
      const $ = cheerio.load(content);

      const applicationHrefs: string[] = [];

      $('.opening a').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          applicationHrefs.push(href);
        }
      });

      for (const [index, url] of applicationHrefs.entries()) {
        try {
          const res = await axios.get(`https://boards.greenhouse.io${url}`);
          fs.writeFile(
            `./data/applications/gh/${file.replace(/(\.txt)$/, `-${index}$1`)}`,
            res.data,
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        } catch (err) {
          console.error('Error fetching application:', err);
        }
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err);
  }
};

const main = async (): Promise<void> => {
  await getJobApplicationsFromGreenhouse();
};

main();
