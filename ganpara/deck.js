const fs = require('fs');
const csvReader = require('../util/csv2deck')();
const csv = require('csvtojson');
module.exports = {
  consumer: async function() {
    return await csvReader.readcsv('external/consumer.csv');
  },
  championship: async function() {
    return await csvReader.readcsv('external/championship.csv');
  },
  customdeck: async function(deckName) {
    const deckStr = fs.readFileSync('external/'+deckName+'.csv').toString();
    const deck = await csv().fromString(deckStr);
    return deck;
  },
  isExistsDeck: function(deckName) {
    try {
      fs.statSync('external/'+deckName+'.csv');
      return true;
    } catch (err) {
      return false;
    }
  },
};
