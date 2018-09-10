class ScenarioParser {
  constructor() {
    this._scenario = [];
  }

  parse(content) {
    let quest;
    let step;

    const lines = content.match(/[^\r\n]+/g);
    lines.forEach((line) => {
      line = line.trim();
      if (!line) return;

      if (line.startsWith('---')) quest = this._processQuest(line);
      else if (line.startsWith('===')) step = this._processStep(line, quest);
      else if (line.startsWith('?')) this._processCondition(line, step);
      else if (line.startsWith('+') || line.startsWith('-')) this._processAffect(line, step);
      else if (line.startsWith('#')) this._processAnswer(line, step);
      else this._processText(line, step);
    });

    return this._scenario;
  }

  _processQuest(line) {
    const quest = {
      name: line.replace(/---/g, '').trim(),
      steps: {}
    };    
    this._scenario.push(quest);
    return quest;
  }

  _processStep(line, quest) {
    const name = line.replace(/===/g, '').trim();
    const step = {
      name: name,
      text: []      
    };
    quest.steps[name] = step;
    return step;
  }

  _processCondition(line, step) {
    if (!step.condition) step.condition = {}; 
    const name = line.substr(1);
    step.condition[name] = 1;
  }

  _processAffect(line, step) {
    if (!step.affect) step.affect = {}; 
    const sign = line.substr(0, 1);
    const name = line.substr(1);
    step.affect[name] = sign === '+' ? 1 : -1;
  }

  _processAnswer(line, step) {
    if (!step.choices) step.choices = []; 
    const groups = line.match(/^#(.+):(.+)/);
    const name = groups[1].trim();
    const text = groups[2].trim();
    step.choices.push({ref: name, text: text});
  }

  _processText(line, step) {
    const text = line.replace(/[\r\n]+/g, '');
    if (step.text.length > 0) {
      step.text.push({br: true});
    }
    step.text.push({text: text});
  }
}

module.exports = ScenarioParser;