const fs = require('fs');

module.exports.writeDataToFile = (filePath, content) => {
  fs.writeFile(filePath, content, (err) => err);
};

module.exports.appendDataToFile = (filePath, content) => {
  fs.appendFile(filePath, content, (err) => err);
};
