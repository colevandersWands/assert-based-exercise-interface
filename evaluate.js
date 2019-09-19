/* in this refactor
  modularize implementation analysis & behavior analyses
    behavioral can run implementation for each test case

*/

function evaluate(func, cases) {

  if (typeof func !== "function") {
    console.error("TypeError: first argument must be a function, received:", func);
    return;
  }
  if (!(cases instanceof Array) && arguments.length > 1) {
    console.error("TypeError: second argument must be an array, received:", cases);
    return;
  }

  const isBehavior = cases instanceof Array
    ? true
    : false

  const evaluationLog = isBehavior
    ? evaluate.assessBehavior(func, cases)
    : evaluate.assessImplementation(func)

  evaluate.renderLogs(evaluationLog, isBehavior);
  evaluate.renderStudyLink(func, evaluationLog.status, isBehavior);

}

evaluate.assessBehavior = function (func, cases) {

  const report = {
    name: func.name
  }

  if (!(cases instanceof Array) || cases.length === 0) {
    report.empty = true;
    report.status = 4;
    return report;
  }

  const testLogs = this.assesTestCases(func, cases);

  const behaviorStatus = !testLogs.every(entry => !entry.err)
    ? 0 // a test case threw an error
    : !testLogs.every(entry => entry.status !== 4)
      ? 4 // one or more test cases were invalid
      : testLogs.every(entry => entry.pass)
        && (testLogs.every(entry => entry.implementationLog.status === 1)
          || testLogs.every(entry => entry.implementationLog.status === 2))
        ? 2 // all tests / asserts pass
        : 3 // one or more tests / asserts failed

  report.status = behaviorStatus;
  report.testLogs = testLogs;

  return report;
}

evaluate.assesTestCases = function (func, cases) {
  const testLogs = [];
  for (let testCase of cases) {

    const validationLog = this.validateTestCase(testCase);
    if (validationLog !== null) {
      testLogs.push(validationLog);
      continue;
    }

    const behaviorLog = {};

    Object.assign(behaviorLog, testCase);

    const implementationLog = evaluate.assessImplementation(func, testCase.args);
    behaviorLog.implementationLog = implementationLog;

    if (implementationLog.status === 0) {
      behaviorLog.err = implementationLog.err;
      behaviorLog.status = 0;
      testLogs.push(behaviorLog);
      continue;
    } else {
      behaviorLog.actual = implementationLog.actual
    }

    behaviorLog.pass = this.compare(behaviorLog.actual, behaviorLog.expected);

    behaviorLog.status = behaviorLog.pass
      && (implementationLog.status === 1
        || implementationLog.status == 2)
      ? 2
      : 3

    testLogs.push(behaviorLog);
  }
  return testLogs
}

evaluate.validateTestCase = function (testCase) {
  const invalidReport = {};

  if (testCase.constructor.name !== "Object") {
    invalidReport.invalidTestCase = new TypeError("is not an Object");
    invalidReport.testCase = testCase;
    invalidReport.status = 4;
    return invalidReport;
  };

  if (!testCase.hasOwnProperty("name")) {
    invalidReport.name = new Error("does not exist");
  }
  else if (typeof testCase.name !== "string") {
    invalidReport.name = new TypeError("is not a string");
  }

  if (!testCase.hasOwnProperty("args")) {
    invalidReport.args = new Error("does not exist");
  }
  else if (testCase.args.constructor.name !== "Array") {
    invalidReport.args = new TypeError("is not an Array");
  }

  if (!testCase.hasOwnProperty("expected")) {
    invalidReport.expected = new Error("does not exist");
  }
  if (Object.keys(invalidReport).length !== 0) {
    const testCaseCopy = Object.assign({}, testCase);
    const x = Object.assign(testCaseCopy, invalidReport);
    testCaseCopy.status = 4;
    return testCaseCopy;
  }

  return null;

}

evaluate.compare = function (actual, expected) {
  let areTheSame;
  if (typeof expected === 'object' && expected !== null) {
    const _actual = JSON.stringify(actual);
    const _expected = JSON.stringify(expected);
    areTheSame = _actual === _expected;
  } else if (expected !== expected) {
    areTheSame = actual !== actual;
  } else {
    areTheSame = actual === expected;
  }
  return areTheSame;
}

// implementational status is based on asserts or error
evaluate.assessImplementation = function (func, args) {
  args = args instanceof Array
    ? args
    : []

  const report = {
    name: func.name
  }

  const consoleCatcher = evaluate.buildConsoleCatcher();

  let actual;
  let err;

  const evaluator = new Function('console', 'args', 'return (' + func.toString() + ')(...args)');
  try {
    actual = evaluator(consoleCatcher, args);
  } catch (error) {
    err = error;
  }

  report.status = err
    ? 0 // there was an error
    : consoleCatcher.asserts.length === 0
      ? 1 // no error or asserts
      : consoleCatcher.asserts.every(entry => entry.assertion)
        ? 2 // all asserts pass
        : 3 // at least one assert fails

  consoleCatcher.asserts.length !== 0
    ? report.asserts = consoleCatcher.asserts
    : null

  consoleCatcher.logs.length !== 0
    ? report.logs = consoleCatcher.logs
    : null

  report.actual = actual

  err !== undefined
    ? report.err = err
    : null

  return report;
}

// refactor to catch all console methods
evaluate.buildConsoleCatcher = function () {
  const consoleInterceptor = Object.create(console);

  consoleInterceptor.asserts = [];
  consoleInterceptor.assert = function (assertion) {
    const args = Array.from(arguments);
    args.shift();
    this.asserts.push({
      assertion: Boolean(assertion),
      messages: [...args]
    })
  }

  consoleInterceptor.logs = [];
  consoleInterceptor.log = function (assertion) {
    const args = Array.from(arguments);
    this.logs.push(args)
  }

  return consoleInterceptor;
}

// views
evaluate.renderLogs = function (log, isBehavior) {
  const mainColor = log.status === 0
    ? "red" // function errored out
    : log.status === 1
      ? "black" // function had no asserts / test cases
      : log.status === 2
        ? "green" // function passed all of it's asserts / test cases
        : log.status === 3
          ? "orange" // function failed one or more asserts / test cases
          : "purple" // function had an invalid test case, status == 4

  const exerciseType = isBehavior
    ? 'behavior'
    : 'implementation'

  console.groupCollapsed("%c" + log.name + ':', "color:" + mainColor, exerciseType);
  {
    isBehavior
      ? this.renderBehavior(log)
      : this.renderImplementation(log);
  }
  console.groupEnd();
}

evaluate.renderBehavior = function (log) {

  if (log.empty) {
    console.log('%cno test cases', 'color:purple');
    return;
  }

  log.testLogs.forEach(entry => {

    // a behavioral test can't be black
    const testColor = entry.status === 0
      ? "red" // function errored out
      : entry.status === 2
        ? "green" // function passed all of it's asserts / test cases
        : entry.status === 3
          ? "orange" // function failed one or more asserts / test cases
          : "purple" // function had an invalid test case, status == 4

    if (entry.status === 4) {
      console.groupCollapsed('%cinvalid test case', 'color:' + testColor);
      {
        const toRender = Object.assign({}, entry);
        delete toRender.status;
        console.log(toRender);
      }
      console.groupEnd();
    } else {
      console.groupCollapsed('%c' + entry.name, 'color:' + testColor);
      {
        entry.status === 0
          ? null
          : this.renderTestLog(entry)

        this.renderImplementation(entry.implementationLog);
      }
      console.groupEnd();
    }

  })

}

evaluate.renderTestLog = function (entry) {

  const caseColor = entry.pass
    ? 'green'
    : 'orange'

  {
    console.log("%cactual: ", 'font-weight: bold; color:' + caseColor, typeof entry.actual, entry.actual)

    console.log("%cexpected: ", 'font-weight: bold; color:blue', typeof entry.expected + ", " + entry.expected);

    if (entry.args.length === 1) {
      console.log('%carg:', 'font-weight: bold; color:blue', typeof entry.args[0], entry.args[0]);
    } else {
      // const renderedArgs = entry.args.map(arg => [typeof arg, arg]);
      // console.log('%cargs: ', 'font-weight: bold; color:blue', renderedArgs);
      for (let i in entry.args) {
        console.log('%carg ' + i + ': ', 'font-weight: bold; color:blue', typeof entry.args[i], entry.args[i]);
      }
    }
  }

}


evaluate.renderError = function (log) {
  const err = log.err;
  console.error('%c' + err.name + ': "' + err.message + '"', 'color: red', '\n  ' + log.name + ' line ' + (err.lineNumber - 3));
}

evaluate.renderImplementation = function (log) {

  log.err
    ? this.renderError(log)
    : null

  if (log.asserts) {
    const assertsColor = log.asserts.every(entry => entry.assertion)
      ? "green" // function passed all of it's asserts / test cases
      : "orange"
    console.groupCollapsed("%casserts:", "color:" + assertsColor);
    {
      log.asserts.forEach(entry => {
        const color = entry.assertion
          ? "green"
          : "orange"
        const msg = entry.assertion
          ? "PASS: "
          : "FAIL: "
        console.log('%c' + msg, 'color:' + color, ...entry.messages);
      });
    }
    console.groupEnd();
  }
  if (log.logs) {
    console.groupCollapsed("logs:");
    {
      log.logs.forEach(messages => console.log(...messages));
    }
    console.groupEnd();
  }
}

evaluate.renderStudyLink = function (func, status, isBehavior) {
  const snippet = isBehavior
    ? func
    : commentTopBottom(func)

  var encoded = encodeURIComponent(snippet);
  var sanitized = encoded.replace(/\(/g, '%28').replace(/\)/g, '%29');
  var deTabbed = sanitized.replace(/%09/g, '%20%20');

  const url = isBehavior
    ? "http://janke-learning.github.io/parsonizer/?snippet=" + deTabbed
    : "http://www.pythontutor.com/live.html#code=" + deTabbed + "&cumulative=false&curInstr=2&heapPrimitives=nevernest&mode=display&origin=opt-live.js&py=js&rawInputLstJSON=%5B%5D&textReferences=false";

  const a = document.createElement('a');
  const viztool = isBehavior
    ? 'Parsonizer'
    : 'JS Tutor'

  a.innerHTML = '<strong>' + func.name + '</strong>:  <i>' + viztool + '</i>';

  a.href = url;
  a.target = '_blank';
  a.style.color = status === 0
    ? "red"
    : status === 1
      ? "black"
      : status === 2
        ? "green"
        : status === 3
          ? "orange"
          : "purple"

  document.body.appendChild(a);
  document.body.appendChild(document.createElement("hr"));

  function commentTopBottom(func) {
    const funcString = func.toString();
    const linesArray = funcString.split("\n");
    linesArray[0] = '// ' + linesArray[0];
    linesArray[linesArray.length - 1] = '// ' + linesArray[linesArray.length - 1];
    return linesArray.join("\n");
  }

}


/*
  Copyright 2019 -> present : janke-learning

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
