const ScenarioParser = require('./scenario-parser');
const fs = require('fs');
const util = require('util');

fs.readFile = util.promisify(fs.readFile);

const TEST_SCENARIO_DIR = './scenario-converter/tests/';

describe('ScenarioParser.parse() tests', () => {
  const scenarios = getAllTestScenarios();
  let parser;

  beforeEach(() => {
    parser = new ScenarioParser();
  });

  test.each(scenarios)(`[%s] should create correct json from text scenario`, async (name) => {
    const text = await readScenarioText(name);
    const expected = await readExpectedJson(name);
  
    const scenarioJson = parser.parse(text);
  
    expect(scenarioJson).toEqual(expected);
  });
});

async function readScenarioText(name) {
  const content = await fs.readFile(`${TEST_SCENARIO_DIR}${name}.txt`, 'utf-8');
  return content.toString();
}

async function readExpectedJson(name) {
  const content = await fs.readFile(`${TEST_SCENARIO_DIR}${name}.json`, 'utf-8');
  return JSON.parse(content);
}

function getAllTestScenarios() {
  const fileNames = fs.readdirSync(TEST_SCENARIO_DIR);
  const namesSet = new Set();
  
  fileNames.forEach(fileName => {
    fileName = fileName.split('.').slice(0, -1).join('.');
    namesSet.add(fileName);
  });

  return Array.from(namesSet);
}