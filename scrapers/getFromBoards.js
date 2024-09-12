const fs = require('fs');
const cheerio = require('cheerio');

const getOpeningsFromBoards = async () => {
  // Lever
  fs.readdir('./data/boards/lever/', (err, files) => {
    files.forEach(async (file, _) => {
      fs.readFile('./data/boards/lever/' + file, (err, content) => {
        // Clear file if it exists
        fs.writeFile('./data/openings/lever/' + file, '', (err) => err);

        const $ = cheerio.load(content);
        const openings = $('.posting');
        openings.each((_, opening) => {
          fs.appendFileSync(
            './data/openings/lever/' + file,
            $(opening).html() + '\n'
          );
        });
      });
    });
  });

  // Greenhouse
  fs.readdir('./data/boards/gh/', (err, files) => {
    files.forEach(async (file, _) => {
      fs.readFile('./data/boards/gh/' + file, (err, content) => {
        // Clear file if it exists
        fs.writeFile('./data/openings/gh/' + file, '', (err) => err);

        const $ = cheerio.load(content);
        const openings = $('.opening');
        openings.each((_, opening) => {
          fs.appendFileSync('./data/openings/gh/' + file, $(opening).html());
        });
      });
    });
  });
};

getOpeningsFromBoards();
