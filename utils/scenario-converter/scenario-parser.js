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
      else if (line.startsWith('?') && parseInt(line.substr(1))) this._processVisit(line, step);
      else if (line.startsWith('?')) this._processCondition(line, step);
      else if (line.startsWith('+') || line.startsWith('-')) this._processAffect(line, step);
      else if (line.startsWith('$')) this._processVariable(line, step);
      else if (line.startsWith('#')) this._processAnswer(line, step);
      else if (line.startsWith('%%')) this._processStatsAndChance(line, step);
      else this._processText(line, step);
    });

    return this._scenario;
  }

  _processQuest(line) {
    const quest = {
      name: line.replace(/---/g, '').trim(),
      steps: []
    };    
    this._scenario.push(quest);
    return quest;
  }

  _processStep(line, quest) {
    const name = line.replace(/===/g, '').trim();
    const step = {
      name: name
    };
    quest.steps.push(step);
    return step;
  }

  _processCondition(line, step) {
    if (!step.condition) step.condition = {}; 
    const arr = line.substr(1).split(' ');
    const name = arr[0];
    
    if (arr.length == 3) {
      step.condition[name] = [parseInt(arr[1]), parseInt(arr[2])]      
    } else {
      step.condition[name] = arr.length > 1 ? parseInt(arr[1]) : 1;
    }
  }

  _processVisit(line, step) {
    if (!step.condition) step.condition = {};
    const visitCount = line.substr(1);
    step.condition["visit"] = parseInt(visitCount);
  }

  _processAffect(line, step) {
    if (!step.affect) step.affect = {}; 
    const sign = line.substr(0, 1);
    const name = line.substr(1);
    step.affect[name] = sign === '+' ? 1 : -1;
  }

  _processVariable(line, step) {
    if (!step.affect) step.affect = {};
    const arr = line.substr(1).split(' ');
    const val = arr.length > 1 ? parseInt(arr[1]) : 1;
    step.affect[arr[0]] = val;
  }

  _processAnswer(line, step) {
    if (!step.choices) step.choices = []; 
    const arr = line.substr(1).split(':');
    if (arr.length > 1) {
      step.choices.push({ref: arr[0].trim(), text: arr[1].trim()});
    } else {
      step.choices.push({ref: arr[0].trim()});
    }
  }

  _processStatsAndChance(line, step) {
    const val = line.substr(2);
    if (!val) {
      step.chance = 50;
    } else if (parseInt(val)) {
      step.chance = parseInt(val);
    } else {
      step.roll = {stat: val};
    }
  }

  _processText(line, step) {
    if (!step.description) step.description = []; 
    const text = line.replace(/[\r\n]+/g, '');
    if (step.description.length > 0) {
      step.description.push({br: true});
    }
    step.description.push({text: text});
  }
}

module.exports = ScenarioParser;