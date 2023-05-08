const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const readline = require('readline');
const { convert } = require('html-to-text');

const GH_URL = 'https://boards.greenhouse.io';
// const LEVER_URL = 'https://jobs.lever.co/';
const RELEVANT_CHUNK_SIGNIFIERS = ['experience'];

const COMPANY_NAME_START_INDICATOR = 'COMPANY_NAME_START* ';
const COMPANY_NAME_END_INDICATOR = ' *COMPANY_NAME_END';

const JOB_TITLE_START_INDICATOR = 'JOB_TITLE_START*';
const JOB_TITLE_END_INDICATOR = '*JOB_TITLE_END';

const POSTING_LINK_START_INDICATOR = 'POSTING_LINK_START*';
const POSTING_LINK_END_INDICATOR = '*POSTING_LINK_END';

const parseGreenhousePostings = () => {
  fs.readFile(
    './data/postings/gh/postings.txt',
    'utf-8',
    async (_, content) => {
      const jobInfoList = content.split('*** START NEW JOB POSTING ***');

      const allJobPostings = new Object();

      const companyNamePattern =
        /COMPANY_NAME_START\*\s*(.*?)\s*\*COMPANY_NAME_END/;
      const jobTitlePattern = /JOB_TITLE_START\*\s*(.*?)\s*\*JOB_TITLE_END/;
      const postingLinkPattern =
        /POSTING_LINK_START\*\s*(.*?)\s*\*POSTING_LINK_END/;

      const parseAllPostings = new Promise((resolve, _) => {
        jobInfoList.forEach((posting, index) => {
          const companyNameMatch = posting.match(companyNamePattern);
          const jobTitleMatch = posting.match(jobTitlePattern);
          const postingLinkMatch = posting.match(postingLinkPattern);

          const companyName =
            companyNameMatch?.length > 1
              ? companyNameMatch[1]
              : 'COMPANY_NAME_NOT_FOUND';

          const jobTitle =
            jobTitleMatch?.length > 1
              ? jobTitleMatch[1]
              : 'JOB_TITLE_NOT_FOUND';

          const postingLink =
            postingLinkMatch?.length > 1
              ? postingLinkMatch[1]
              : 'POSTING_LINK_NOT_FOUND';

          const splitPosting = posting.split(/[\.*]/);

          const relevantContent = [];

          // Check every chunk and see which are relevant
          splitPosting.forEach((chunk) => {
            const containsSubstring = RELEVANT_CHUNK_SIGNIFIERS.some((rel) =>
              chunk.includes(rel)
            );

            if (containsSubstring) {
              relevantContent.push(chunk);
            }
          });

          if (relevantContent.length !== 0) {
            const postingInfo = {
              jobTitle,
              postingLink: GH_URL + postingLink,
              relevantContent,
            };

            if (allJobPostings.hasOwnProperty(companyName)) {
              allJobPostings[companyName].postings.push(postingInfo);
            } else {
              allJobPostings[companyName] = {
                postings: [postingInfo],
              };
            }
          }

          if (index === jobInfoList.length - 1) {
            resolve();
          }
        });
      });

      parseAllPostings.then(() => {
        const allPostingsAsJSON = JSON.stringify(allJobPostings);

        fs.writeFile(
          './data/parsedPostings/ghFinalOutput.json',
          allPostingsAsJSON,
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
          }
        );
      });
    }
  );
};

const parseLeverPostings = () => {
  fs.readFile(
    './data/postings/lever/postings.txt',
    'utf-8',
    async (_, content) => {
      const jobInfoList = content.split('*** START NEW JOB POSTING ***');

      const allJobPostings = new Object();

      const companyNamePattern =
        /COMPANY_NAME_START\*\s*(.*?)\s*\*COMPANY_NAME_END/;
      const jobTitlePattern = /JOB_TITLE_START\*\s*(.*?)\s*\*JOB_TITLE_END/;
      const postingLinkPattern =
        /POSTING_LINK_START\*\s*(.*?)\s*\*POSTING_LINK_END/;

      const parseAllPostings = new Promise((resolve, _) => {
        jobInfoList.forEach((posting, index) => {
          const companyNameMatch = posting.match(companyNamePattern);
          const jobTitleMatch = posting.match(jobTitlePattern);
          const postingLinkMatch = posting.match(postingLinkPattern);

          const companyName =
            companyNameMatch?.length > 1
              ? companyNameMatch[1]
              : 'COMPANY_NAME_NOT_FOUND';

          const jobTitle =
            jobTitleMatch?.length > 1
              ? jobTitleMatch[1]
              : 'JOB_TITLE_NOT_FOUND';

          const postingLink =
            postingLinkMatch?.length > 1
              ? postingLinkMatch[1]
              : 'POSTING_LINK_NOT_FOUND';

          const splitPosting = posting.split(/[\.*]/);

          const relevantContent = [];

          // Check every chunk and see which are relevant
          splitPosting.forEach((chunk) => {
            const containsSubstring = RELEVANT_CHUNK_SIGNIFIERS.some((rel) =>
              chunk.includes(rel)
            );

            if (containsSubstring) {
              relevantContent.push(chunk);
            }
          });

          if (relevantContent.length !== 0) {
            const postingInfo = {
              jobTitle,
              postingLink: postingLink,
              relevantContent,
            };

            if (allJobPostings.hasOwnProperty(companyName)) {
              allJobPostings[companyName].postings.push(postingInfo);
            } else {
              allJobPostings[companyName] = {
                postings: [postingInfo],
              };
            }
          }

          if (index === jobInfoList.length - 1) {
            resolve();
          }
        });
      });

      parseAllPostings.then(() => {
        const allPostingsAsJSON = JSON.stringify(allJobPostings);

        fs.writeFile(
          './data/parsedPostings/leverFinalOutput.json',
          allPostingsAsJSON,
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
          }
        );
      });
    }
  );
};

// Get the postings for gh
const readGreenhouseOpenings = async () => {
  try {
    fs.readdir('./data/openings/gh', (err, files) => {
      files.forEach(async (file, _) => {
        const fileStream = fs.createReadStream('./data/openings/gh/' + file);

        const rl = readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity,
        });
        let lineNumber = 0;
        let postingLinks = [];
        let companyName = file.replace('.txt', '');
        companyName =
          companyName.charAt(0).toUpperCase() + companyName.slice(1);

        rl.on('line', (line) => {
          if (lineNumber !== 0 && lineNumber % 4 == 1) {
            // Get href from line
            const $ = cheerio.load(line);
            const postingLink = $('a').attr('href');
            const jobTitle = $('a').text();

            postingLinks.push({ postingLink, jobTitle });
          }
          lineNumber++;
        });

        rl.on('close', () => {
          postingLinks.forEach(async ({ postingLink, jobTitle }) => {
            if (postingLink === undefined) return;
            let res = null;
            try {
              res = await axios.get(GH_URL + postingLink);
            } catch (err) {
              return;
            }
            const data = await res.data;
            const convertedData = convert(data);

            const companyNameChunk =
              COMPANY_NAME_START_INDICATOR +
              companyName +
              COMPANY_NAME_END_INDICATOR +
              '\n';
            const jobTitleChunk =
              JOB_TITLE_START_INDICATOR +
              jobTitle +
              JOB_TITLE_END_INDICATOR +
              '\n';

            const postingChunk =
              POSTING_LINK_START_INDICATOR +
              postingLink +
              POSTING_LINK_END_INDICATOR +
              '\n';

            const jobData =
              '*** START NEW JOB POSTING ***\n' +
              companyNameChunk +
              jobTitleChunk +
              postingChunk +
              convertedData +
              '*** END NEW JOB POSTING ***\n';

            // Clear file then append postings to it
            // fs.truncate('./data/postings/gh/postings.txt', 0, () => {})

            fs.appendFile('./data/postings/gh/postings.txt', jobData, (err) => {
              if (err) {
                console.log('Error writing gh openings', err);
              }
            });
          });
        });
      });
    });
  } catch (err) {
    console.error(err);
  }
};

const readLeverOpenings = async () => {
  try {
    fs.readdir('./data/openings/lever', (err, files) => {
      files.forEach(async (file, _) => {
        const fileStream = fs.createReadStream('./data/openings/lever/' + file);

        const rl = readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity,
        });

        let postingLinks = [];
        let companyName = file.replace('.txt', '');
        companyName =
          companyName.charAt(0).toUpperCase() + companyName.slice(1);

        rl.on('line', (line) => {
          // Get href from line
          const $ = cheerio.load(line);
          const postingLink = $('a').attr('href');
          const jobTitle = $('h5').text();

          postingLinks.push({ postingLink, jobTitle });
        });

        rl.on('close', () => {
          postingLinks.forEach(async ({ postingLink, jobTitle }) => {
            let res = null;
            try {
              res = await axios.get(postingLink);
            } catch (error) {
              return;
            }
            const data = await res.data;
            const convertedData = convert(data);

            const companyNameChunk =
              COMPANY_NAME_START_INDICATOR +
              companyName +
              COMPANY_NAME_END_INDICATOR +
              '\n';
            const jobTitleChunk =
              JOB_TITLE_START_INDICATOR +
              jobTitle +
              JOB_TITLE_END_INDICATOR +
              '\n';

            const postingChunk =
              POSTING_LINK_START_INDICATOR +
              postingLink +
              POSTING_LINK_END_INDICATOR +
              '\n';

            const jobData =
              '*** START NEW JOB POSTING ***\n' +
              companyNameChunk +
              jobTitleChunk +
              postingChunk +
              convertedData +
              '*** END NEW JOB POSTING ***\n';

            // Clear file
            // fs.truncate('./data/postings/gh/postings.txt', 0, () => {});

            fs.appendFile(
              './data/postings/lever/postings.txt',
              jobData,
              (err) => {
                if (err) {
                  console.log('Error writing lever openings', err);
                }
              }
            );
          });
        });
      });
    });
  } catch (err) {
    console.error(err);
  }
};

const main = async () => {
  // await readGreenhouseOpenings();
  // await readLeverOpenings();

  parseGreenhousePostings();
  parseLeverPostings();
};

main();
