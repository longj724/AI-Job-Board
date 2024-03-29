// External Dependencies
import axios from 'axios';
import fs from 'fs';

export const getJobBoards = async (name: string): Promise<void> => {
  // Try Lever
  const leverUrl = `https://jobs.lever.co/${name}`;
  let success = true;

  try {
    const res = await axios.get(leverUrl);
    const data = res.data;
    console.log('lever - writing to files');

    if (fs.existsSync(`./data/boards/lever/${name}.txt`)) {
      console.log('Company job board already exists on lever');
      return;
    }

    if (fs.existsSync(`./data/boards/gh/${name}.txt`)) {
      console.log('Company job board already exists on greenhouse');
      return;
    }

    fs.writeFile(`./data/boards/lever/${name}.txt`, data, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  } catch (err: any) {
    const errorMessage = err.response ? err.response.data.message : err.message;
    console.error(errorMessage);
    success = false;
  }

  if (!success) {
    // Try greenhouse
    const greenhouseUrl = `https://boards.greenhouse.io/${name}`;

    try {
      const res = await axios.get(greenhouseUrl);
      const data = res.data;
      console.log('greenhouse - writing to files');

      fs.writeFile(`./data/boards/gh/${name}.txt`, data, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    } catch (err: any) {
      const errorMessage = err.response
        ? err.response.data.message
        : err.message;
      console.error(errorMessage);
    }
  }
};
