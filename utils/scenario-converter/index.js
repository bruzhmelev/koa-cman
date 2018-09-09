const fs = require('fs');
const util = require('util');
const ScenarioParser = require('./scenario-parser');

fs.readFile = util.promisify(fs.readFile);

(async function main() {
  if (process.argv.length < 3 || !process.argv[2]) 
    throw new Error('Scenario text file path should be passed as the first command line parameter');

  const filePath = process.argv[2];
  const content = await fs.readFile(filePath, 'utf-8');
  // const parser = new ScenarioParser();
  // parser.parse(content.toString());
  console.log(content.toString())
})()
  .catch(err => console.log(err));
