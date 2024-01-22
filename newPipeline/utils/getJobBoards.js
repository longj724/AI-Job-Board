const axios = require('axios');
const fs = require('fs');

module.exports.getJobBoards = async (name) => {
  // Try Lever
  const leverUrl = 'https://jobs.lever.co/' + name;
  let success = true;

  const res = await axios
    .get(leverUrl)
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      console.log('lever - writing to files');

      // Don't think we want these checks. We probably want to
      // create new boards as the boards will have updated company data
      // At the same time we don't want to fetch boards multiple times
      // as we will have the companies at multiple boards
      // Maybe have a shouldRefetchBoard option
      // Can have this check on initial fetch but on further fetches
      // can have a newData folder that checks if already fetched
      if (fs.existsSync('./data/boards/lever/' + name + '.txt')) {
        console.log('Company job board already exists on lever');
        return;
      }

      if (fs.existsSync('./data/boards/gh/' + name + '.txt')) {
        console.log('Company job board already exists on greenhouse');
        return;
      }

      fs.writeFile('./data/boards/lever/' + name + '.txt', data, (err) => err);
    })
    .catch((err) => {
      let message =
        typeof err.response !== 'undefined'
          ? err.response.data.message
          : err.message;
      success = false;
      return message;
    });

  if (!success) {
    // Try greenhouse
    const greenhouseUrl = 'https://boards.greenhouse.io/' + name;

    const res = await axios
      .get(greenhouseUrl)
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        console.log('greenhouse - writing to files');

        fs.writeFile('./data/boards/gh/' + name + '.txt', data, (err) => err);
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
