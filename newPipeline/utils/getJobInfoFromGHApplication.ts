// External Dependencies
import fs from 'fs';
import cheerio from 'cheerio';
import dotenv from 'dotenv';
dotenv.config();

// Relative Dependencies
import { db } from '../prismaClient';

export const getJobInfoFromGreenhouseApplications = async (): Promise<void> => {
  const files = fs.readdirSync('./activeData/applications/gh');

  for (const file of files) {
    const content = fs.readFileSync(
      `./activeData/applications/gh/${file}`,
      'utf-8'
    );
    const $ = cheerio.load(content);

    const companyName = $('.company-name').text().replace('at', '').trim();
    const jobTitle = $('.app-title').text().trim();
    const location = $('.location').text().trim();

    console.log('companyInfo is', {
      companyName,
      jobTitle,
      location,
      boardType: 'Greenhouse',
    });

    await db.posting.create({
      data: {
        company: companyName,
        job_title: jobTitle,
        location: location,
      },
    });
  }
};

const main = (): void => {
  getJobInfoFromGreenhouseApplications();
};

main();
