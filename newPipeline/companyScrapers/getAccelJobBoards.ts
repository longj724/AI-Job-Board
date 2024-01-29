// External Dependencies
import fs from 'fs';

// Relative Dependencies
import { getJobBoards } from '../utils/getJobBoards';

const getAccelJobBoards = () => {
  const data = fs.readFileSync('./data/companies/accel.txt', 'utf8');

  const companiesList = data.split('\n');

  companiesList.forEach((name: string) => {
    getJobBoards(name);
  });
};

const main = async () => {
  getAccelJobBoards();
};

main();
