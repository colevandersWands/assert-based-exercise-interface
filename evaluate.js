/*
d elete from copy of testLog -> already done
c lose whole thing -> done
a rguments object compatibile -> done
l og all console methods
f reeze upon return -> done
*/

const evaluate = (() => {
  function evaluate(func, cases) {

    if (typeof func !== "function") {
      console.error("TypeError: first argument must be a function, received:", func);
      return new TypeError("first argument must be a function");
    }
    if (!(cases instanceof Array) && arguments.length > 1) {
      console.error("TypeError: second argument must be an array, received:", cases);
      return new TypeError("second argument must be an array");
    }

    const isBehavior = cases ? true : false;

    const isNative = evaluate.isNativeFunction(func);

    const evaluationLog = isBehavior
      ? evaluate.assessBehavior(func, cases, isNative)
      : evaluate.assessImplementation(func, isNative)

    evaluate.renderLogs(evaluationLog, isBehavior);
    evaluate.renderStudyLink(func, evaluationLog.status, isBehavior, isNative);

    return evaluationLog;

  }


  evaluate.isNativeFunction = (arg) => {
    // https://davidwalsh.name/detect-native-function

    const toString = Object.prototype.toString;
    const fnToString = Function.prototype.toString;
    const reHostCtor = /^\[object .+?Constructor\]$/;
    const reNative = RegExp('^' +
      String(toString)
        .replace(/[.*+?^${}()|[\]\/\\]/g, '\\$&')
        .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    const argType = typeof arg;
    return argType == 'function'
      ? reNative.test(fnToString.call(arg))
      : (arg && argType == 'object' && reHostCtor.test(toString.call(arg))) || false;
  }

  evaluate.assessBehavior = (func, cases, isNative) => {

    const report = {
      name: func.name
    }
    isNative
      ? report.isNative = true
      : null

    if (cases.length === 0) {
      report.empty = true;
      report.status = 4;
      return report;
    }

    const testLogs = evaluate.assesTestCases(func, cases, isNative);

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

  evaluate.assesTestCases = (func, cases, isNative) => {

    const testLogs = [];
    for (let testCase of cases) {

      const validationLog = evaluate.validateTestCase(testCase);
      if (validationLog !== null) {
        testLogs.push(validationLog);
        continue;
      }

      const behaviorLog = {};

      Object.assign(behaviorLog, testCase);

      const implementationLog = evaluate.assessImplementation(func, isNative, testCase.args);
      behaviorLog.implementationLog = implementationLog;

      if (implementationLog.status === 0) {
        behaviorLog.err = implementationLog.err;
        behaviorLog.status = 0;
        testLogs.push(behaviorLog);
        continue;
      } else {
        behaviorLog.actual = implementationLog.actual
      }

      behaviorLog.pass = evaluate.compare(behaviorLog.actual, behaviorLog.expected);

      behaviorLog.status = behaviorLog.pass
        && (implementationLog.status === 1
          || implementationLog.status == 2)
        ? 2
        : 3

      testLogs.push(behaviorLog);
    }
    return testLogs
  }

  evaluate.validateTestCase = (testCase) => {
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

  evaluate.compare = (actual, expected) => {
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
  evaluate.assessImplementation = (func, isNative, args) => {

    args = args instanceof Array
      ? args
      : []

    const report = {
      name: func.name
    }

    isNative
      ? report.isNative = true
      : null

    const evaluation = evaluate.evaluate(func, isNative, args);

    report.status = evaluation.result instanceof Error
      ? 0 // there was an error
      : evaluation.caught.assert.length === 0
        ? 1 // no error or asserts
        : evaluation.caught.assert.every(entry => entry.assertion)
          ? 2 // all asserts pass
          : 3 // at least one assert fails

    // consoleCatcher.asserts.length !== 0
    //   ? report.asserts = consoleCatcher.asserts
    //   : null

    // consoleCatcher.logs.length !== 0
    //   ? report.logs = consoleCatcher.logs
    //   : null

    report.consoleCalls = evaluation.caught;

    report.status === 0
      ? report.err = evaluation.result
      : undefined

    report.status !== 0
      ? report.actual = evaluation.result
      : null

    return report;
  }

  evaluate.evaluate = (func, isNative, args) => {
    const consoleCatcher = evaluate.buildConsoleCatcher();

    let result;
    if (isNative) {
      try {
        result = func(...args);
      } catch (error) {
        result = error;
      }
    } else {
      // passing 'evaluate' as an arg allows meta-ing
      const evaluatorWrapper = new Function('console', 'evaluate', 'return ' + func.toString());
      const evaluator = evaluatorWrapper(consoleCatcher, evaluate);
      try {
        result = evaluator(...args);
      } catch (error) {
        result = error;
      }
    }

    return {
      result,
      caught: consoleCatcher.caught
    }
  }

  // refactor to catch all console methods
  evaluate.buildConsoleCatcher = () => {
    const consoleInterceptor = Object.create(console);
    consoleInterceptor.caught = {};

    consoleInterceptor.caught.assert = [];
    consoleInterceptor.assert = function (assertion) {
      const args = Array.from(arguments);
      args.shift();
      consoleInterceptor.caught.assert.push({
        assertion: Boolean(assertion),
        messages: [...args]
      })
    }

    const consoleKeys = Object.keys(console);
    consoleKeys.forEach(key => {
      if (key === 'assert' || (typeof console[key] !== 'function')) {
      }
      else if (key === 'clear'
        || key === 'groupCollapse'
        || key === 'groupEnd'
        || key === 'group') {
        consoleInterceptor[key] = function () {
          const args = Array.from(arguments);
          console[key](func.name + ': ', ...args);
          consoleInterceptor.caught = true;
        }
      }
      else if (key === 'log'
        || key === 'log'
        || key === 'dir'
        || key === 'dirxml'
        || key === 'info'
        || key === 'warn'
        || key === 'table') {
        consoleInterceptor.caught[key] = [];
        consoleInterceptor[key] = function () {
          const args = Array.from(arguments);
          consoleInterceptor.caught[key].push(args);
        }
      }
    });

    return consoleInterceptor;
  }

  // views
  evaluate.renderLogs = (log, isBehavior) => {

    const mainColor = log.status === 0
      ? "red" // function errored out
      : log.status === 1
        ? "black" // function had no asserts / test cases
        : log.status === 2
          ? "green" // function passed all of it's asserts / test cases
          : log.status === 3
            ? "orange" // function failed one or more asserts / test cases
            : "purple" // function had an invalid test case, status == 4


    const nativity = log.isNative
      ? ' (native)'
      : ''

    const exerciseType = isBehavior
      ? 'behavior'
      : 'implementation'

    console.groupCollapsed("%c" + log.name + nativity + ':', "color:" + mainColor, exerciseType);
    {

      !isBehavior && log.err
        ? evaluate.renderError(log)
        : null

      isBehavior
        ? evaluate.renderBehavior(log)
        : evaluate.renderImplementation(log);
    }
    console.groupEnd();
  }

  evaluate.renderBehavior = (log) => {

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
          evaluate.renderTestLog(entry)
          evaluate.renderImplementation(entry.implementationLog);
        }
        console.groupEnd();
      }

    })

  }


  evaluate.renderTestLog = (entry) => {

    const caseColor = entry.pass
      ? 'green'
      : 'orange'

    {
      entry.err
        ? evaluate.renderError(entry)
        : console.log("%cactual: ", 'font-weight: bold; color:' + caseColor, typeof entry.actual, entry.actual)

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


  evaluate.renderImplementation = (log) => {

    if (log.consoleCalls.asserts) {
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
    for (let key in log.consoleCalls) {
      if (key === 'assert') {
      }
      else if (log.consoleCalls[key].length > 0) {
        console.groupCollapsed(key + "s:");
        {
          log.consoleCalls[key].forEach(messages => console[key](...messages));
        }
        console.groupEnd();
      }
    }
  }


  evaluate.renderError = (log) => {
    const err = log.err;
    console.error('%c' + err.name + ': "' + err.message + '"', 'color: red', '\n  ' + log.name + ' line ' + (err.lineNumber - 3));
  }

  evaluate.renderStudyLink = (func, status, isBehavior, isNative) => {
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

    const nativity = isNative
      ? ' (native)'
      : ''

    const viztool = isBehavior
      ? 'Parsonizer'
      : 'JS Tutor'

    a.innerHTML = '<strong>' + func.name + nativity + '</strong>:  <i>' + viztool + '</i>';

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

  return Object.freeze(evaluate);
})()

/*
  Copyright 2019 -> present : janke-learning

  Permission is hereby granted, free of charge, to any person obtaining a copy of evaluate software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and evaluate permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
