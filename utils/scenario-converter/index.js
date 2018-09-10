const fs = require('fs');
const util = require('util');
const ScenarioParser = require('./scenario-parser');

fs.readFile = util.promisify(fs.readFile);
fs.writeFile = util.promisify(fs.writeFile);

(async function main() {
  if (process.argv.length < 3 || !process.argv[2]) 
    throw new Error('Scenario text file path should be passed as the first command line parameter');

  const filePath = process.argv[2];
  const content = await fs.readFile(filePath, 'utf-8');
  const parser = new ScenarioParser();
  const scenarios = parser.parse(content.toString());
  const formattedOutput = await formatOutput(scenarios);
  await fs.writeFile('output.js', formattedOutput, 'utf-8');
})()
  .catch(err => console.log(err));

async function formatOutput(scenarios) {
  const content = await fs.readFile('output-template.js', 'utf-8');
  const formattedScenarios = JSON.stringify(scenarios, null, 2);
  return content.toString().replace('[SCENARIOS]', formattedScenarios);
}