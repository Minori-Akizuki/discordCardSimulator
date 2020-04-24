const csvReader = require('csvtojson')();

module.exports = function() {
  return {
    readcsv: async function(path) {
      const json = await csvReader.fromFile(path);
      return json;
    },
  };
};
