const csvReader = require('../util/csv2deck')();
module.exports = {
  consumer: function() {
    return csvReader.readcsv('external/consumer.csv');
  },
  championship: function() {
    return csvReader.readcsv('external/championship.csv');
  },
  customdeck: function(deckName) {
    return csvReader.readcsv('external/'+deckName+'.csv');
  },
};
