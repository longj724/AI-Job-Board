// External Dependencies
import fs from 'fs';

// Relative Dependencies
import { getJobBoards } from '../utils/getJobBoards';

const getCanaanJobBoards = () => {
  const data = fs.readFileSync('./data/companies/Canaan.txt', 'utf8');

  const companiesList = data.split('\n');

  companiesList.forEach((name: string) => {
    getJobBoards(name);
  });
};

const main = async () => {
  getCanaanJobBoards();
};

main();
