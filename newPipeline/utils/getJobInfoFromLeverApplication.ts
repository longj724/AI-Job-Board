// External Dependencies
import fs from 'fs';
import cheerio from 'cheerio';
import dotenv from 'dotenv';
dotenv.config();

// Relative Dependencies
import { db } from '../prismaClient';

export const getJobInfoFromLeverApplications = async (): Promise<void> => {
  const files = fs.readdirSync('./activeData/applications/lever');

  for (const file of files) {
    const content = fs.readFileSync(
      `./activeData/applications/lever/${file}`,
      'utf-8'
    );

    const $ = cheerio.load(content);

    const companyName = file.split('-')[0].trim();
    const jobTitle = $('.posting-headline h2').text().trim();
    const location = $('.location').text();

    const department = $('.department').text().trim();
    const commitment = $('.commitment').text().trim();
    const workplaceType = $('.workplaceTypes').text().trim();

    console.log('companyInfo is', {
      companyName,
      jobTitle,
      location,
      department,
      commitment,
      workplaceType,
      boardType: 'Lever',
    });

    await db.posting.create({
      data: {
        company: companyName,
        job_title: jobTitle,
        location: location,
        workplace_type: workplaceType,
      },
    });
  }
};

const main = (): void => {
  getJobInfoFromLeverApplications();
};

main();
