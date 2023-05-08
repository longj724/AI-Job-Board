const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const { writeDataToFile } = require('../utils/fileOperations.js');

module.exports.getJobData = async (name, firm) => {
  // Try Lever
  let leverUrl = 'https://jobs.lever.co/' + name;
  let success = true;

  let res = await axios
    .get(leverUrl)
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      console.log('lever - writing to files');
      if (fs.existsSync('./data/boards/lever/' + name + '.txt')) {
        return;
      }

      if (fs.existsSync('./data/boards/gh/' + name + '.txt')) {
        return;
      }

      writeDataToFile('./data/boards/lever/' + name + '.txt', data);

      const $ = cheerio.load(data);
      const openings = $('.posting');
      // Add firm name to file
      // fs.appendFileSync('./data/openings/lever/' + name + '.txt', firm + '\n');
      openings.each((_, opening) => {
        if ($(opening).html().toLowerCase().includes('software engineer')) {
          console.log('opening.html is', $(opening).html());
          fs.appendFileSync(
            './data/openings/lever/' + name + '.txt',
            $(opening).html() + '\n'
          );
        }
      });
    })
    .catch((err) => {
      let message =
        typeof err.response !== 'undefined'
          ? err.response.data.message
          : err.message;
      success = false;
      return message;
    });

  if (success) {
    return;
  } else {
    // Try greenhouse
    let greenhouseUrl = 'https://boards.greenhouse.io/' + name;

    res = await axios
      .get(greenhouseUrl)
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        console.log('greenhouse - writing to files');

        writeDataToFile('./data/boards/gh/' + name + '.txt', data);

        const $ = cheerio.load(data);
        const openings = $('.opening');
        // Add firm name to file
        // fs.appendFileSync('./data/openings/gh/' + name + '.txt', firm);
        openings.each((_, opening) => {
          // Check to see if the opening is for a software engineer position
          if ($(opening).html().toLowerCase().includes('software engineer')) {
            fs.appendFileSync(
              './data/openings/gh/' + name + '.txt',
              $(opening).html()
            );
          }
        });
      })
      .catch((err) => {
        let message =
          typeof err.response !== 'undefined'
            ? err.response.data.message
            : err.message;

        return message;
      });
  }
};
