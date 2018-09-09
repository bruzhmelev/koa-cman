class ScenarioParser {
  constructor() {
    this._scenario = [];
  }

  parse(content) {
    // let quest;
    // let step;

    // const lines = content.match(/[^\r\n]+/g);
    // lines.forEach((line) => {
    //   if (!line.trim()) return;

    //   if (line.startsWith('---')) {
    //     quest = {
    //       name: line.replace('---', '').trim(),
    //       steps: {}
    //     };
    //   } else if (line.startsWith('===')) {
    //     steps
    //   }

    // });

    return this._scenario;
  }
}

module.exports = ScenarioParser;