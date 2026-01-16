// Local JSON database configuration
// Using JSON file for local development instead of PostgreSQL

const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({ users: [] }, null, 2));
}

module.exports = {
  readData: () => {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  },
  writeData: (data) => {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  }
};
