// External Dependencies
import fs from 'fs';
import cheerio from 'cheerio';
import axios from 'axios';

// This will read through all lever job boards and get applications
export const getJobApplicationsFromLever = async (): Promise<void> => {
  try {
    const files = fs.readdirSync('./data/boards/lever');
    files.forEach((file) => {
      const content = fs.readFileSync(`./data/boards/lever/${file}`, 'utf-8');
      const $ = cheerio.load(content);

      const applicationHrefs: string[] = [];

      $('a.posting-title').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          applicationHrefs.push(href);
        }
      });

      applicationHrefs.forEach((url, index) => {
        axios
          .get(url)
          .then((res) => {
            // Want to just save the application to read from later
            fs.writeFile(
              `./data/applications/lever/${file.replace(
                /(\.txt)$/,
                `-${index}$1`
              )}`,
              res.data,
              (err) => {
                if (err) {
                  console.log(err);
                }
              }
            );
          })
          .catch((err: any) => {});
      });
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error reading directory:', err.message);
    } else {
      console.error('An unknown error occurred');
    }
  }
};

const main = (): void => {
  getJobApplicationsFromLever();
};

main();
