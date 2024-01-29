// External Dependencies
import fs from 'fs';

// Relative Dependencies
import { getJobBoards } from '../utils/getJobBoards';

const getGreycroftJobBoards = () => {
  const data = fs.readFileSync('./data/companies/Greycroft.txt', 'utf8');

  const companiesList = data.split('\n');

  companiesList.forEach((name: string) => {
    getJobBoards(name);
  });
};

const main = async () => {
  getGreycroftJobBoards();
};

main();
