const { getJobBoards } = require('./utils/getJobBoards');
const fs = require('fs');

const getAccelJobBoards = () => {
  const data = fs.readFileSync('./data/companies/accel.txt', 'utf8');

  const companiesList = data.split('\n');

  companiesList.forEach((name) => {
    getJobBoards(name);
  });
};

const main = async () => {
  getAccelJobBoards();
};

main();
