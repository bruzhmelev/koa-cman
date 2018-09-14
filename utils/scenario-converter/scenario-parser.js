const jsonEval = require('json-eval');

class ScenarioParser {
  constructor() {
    this._scenario = [];
  }

  parse(content) {
    let quest;
    let step;
    let json = '';
    let isJsonStep = false;

    const lines = content.match(/[^\r\n]+/g);
    lines.forEach((line) => {
      line = line.trim();
      if (!line) return;

      if (json) {
        if (line.startsWith('}}')) { 
          step = this._processJson(json + '}}', step, quest); 
          isJsonStep = true; 
          json = '';
        } else { 
          json += line.replace(/[\r\n]+/g, '').trim();
        }
        return;
      }

      if (line.startsWith('---')) quest = this._processQuest(line);
      else if (line.startsWith('===')) { step = this._processStep(line, quest); isJsonStep = false; }
      else if (line.startsWith('{{') && line.endsWith('}}')) { step = this._processJson(line, step, quest); isJsonStep = true; }
      else if (line.startsWith('{{')) { json = '{{'; }
      else if (isJsonStep) return;
      else if (line.startsWith('>>')) this._processParent(line, step);
      else if (line.startsWith('?') && parseInt(line.substr(1))) this._processVisit(line, step);
      else if (line.startsWith('?')) this._processCondition(line, step);
      else if ((line.startsWith('+') || line.startsWith('-')) && line[1] && line[1] !== ' ') this._processAffect(line, step);
      else if (line.startsWith('$')) this._processVariable(line, step);
      else if (line.startsWith('#')) this._processAnswer(line, step);
      else if (line.startsWith('%%')) this._processStatsAndChance(line, step);
      else this._processDescription(line, step);
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

  _processJson(line, step, quest) {
    const innerText = line.slice(1, -1).trim();
    const jsonStep = jsonEval(innerText);
    jsonStep.name = step.name;
    quest.steps[quest.steps.length - 1] = jsonStep;
    return jsonStep;
  }

  _processParent(line, step) {
    line = line.replace('>>', '');
    const arr = line.split('@');
    if (arr[1] && arr[1].trim()) step.parent = { step: arr[0].trim(), quest: arr[1].trim() };
    else step.parent = { step: arr[0].trim() };
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
  
  _processDescription(line, step, isNewLine = true) {
    if (!step.description) step.description = []; 
    
    let text = line.replace(/[\r\n]+/g, '').trim();
    if (!text) return;

    if (step.description.length > 0 && isNewLine) {
      step.description.push({br: true});
    }

    const groups = this._extractTextGroups(text);

    if (groups) {
      for (let g of groups) {
        this._processDescription(g, step, false);
      }
      return;
    }

    for (let t of this._processTextSpecialCases(text)) {
      step.description.push(t);
    }
  }  

  _extractTextGroups(text) {
    const groups = text.match(/\[([^\[\]]*)\]/g);    
    if (!groups) return null;

    const groupTexts = [];
    for (let g of groups) {
      groupTexts.push(g.slice(1, -1).trim());
      text = text.replace(g, '|');
    }

    const otherTexts = text.split('|');
    const resultTexts = [];
    for (let i = 0; i < otherTexts.length; i++) {
      if (otherTexts[i].trim()) resultTexts.push(otherTexts[i].trim());
      if (groupTexts[i]) resultTexts.push(groupTexts[i]);
    }

    return resultTexts;
  }

  _processTextSpecialCases(text) {
    const groups = text.match(/\{([^\{\}]*)\}/g);
    if (!groups) return [{ text: text }];

    const variables = [];
    const textWithCondition = {};
    
    for (let g of groups) {
      const t = g.slice(1, -1).trim();
      if (t.startsWith('?')) {
        if (parseInt(t.substr(1))) this._processVisit(t, textWithCondition);
        else this._processCondition(t, textWithCondition);
        text = text.replace(g, '');
      } else if (t.startsWith('$')) {
        variables.push({ variable: t.substr(1).trim() })
        text = text.replace(g, '|');
      } else {
        text = text.replace(g, '');
      }
    }

    const otherTexts = text.split('|');
    const resultTexts = [];

    for (let i = 0; i < otherTexts.length; i++) {
      if (otherTexts[i].trim()) {
        if (textWithCondition.condition) {
          resultTexts.push({ text: otherTexts[i].trim(), condition: textWithCondition.condition });
        } else {
          resultTexts.push({ text: otherTexts[i].trim() });
        }
      }

      if (variables[i]) {
        if (textWithCondition.condition) {
          variables[i].condition = textWithCondition.condition;
        }
        resultTexts.push(variables[i]);
      }
    }

    return resultTexts;
  }
}

module.exports = ScenarioParser;