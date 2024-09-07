// simplifiedCodeAnalysisService.js

export const detectLanguage = (code) => {
  if (code.includes('interface') || code.includes(':')) {
    return 'typescript';
  } else {
    return 'javascript';
  }
};

export const validateCode = (code) => {
  const hasFunction = /function/.test(code) || /=>/.test(code);
  const hasVariable = /var |let |const /.test(code);
  const hasLoop = /for |while/.test(code);
  
  return hasFunction || hasVariable || hasLoop;
};

const runChecks = (code) => {
  const issues = [];

  if (code.length > 500) {
    issues.push({ type: 'length', message: 'Your code is longer than a CVS receipt.' });
  }

  if ((code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length) {
    issues.push({ type: 'brackets', message: 'Unmatched brackets. Playing hide and seek, are we?' });
  }

  if (code.includes('TODO')) {
    issues.push({ type: 'todo', message: 'TODOs in production? Living life on the edge!' });
  }

  if (code.includes('debugger')) {
    issues.push({ type: 'debugger', message: 'A wild debugger appeared! Gotta catch \'em all?' });
  }

  const longLines = code.split('\n').filter(line => line.length > 100);
  if (longLines.length > 0) {
    issues.push({ type: 'line-length', message: `You have ${longLines.length} lines longer than 100 characters. Your lines are so long, they need their own zip code.` });
  }

  if (code.includes('var ')) {
    issues.push({ type: 'var', message: 'Using var? What year is it, 2015?' });
  }

  if (code.includes('==')) {
    issues.push({ type: 'equality', message: 'Using == instead of ===? I too like to live dangerously.' });
  }

  return issues;
};

export const analyzeCode = (code) => {
  if (!validateCode(code)) {
    return { isValid: false, message: "This doesn't look like code. Are you trying to send a secret message?" };
  }

  const language = detectLanguage(code);
  const issues = runChecks(code);

  return { isValid: true, language, issues };
};