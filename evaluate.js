function evaluate(func) {

  const assertLog = [];

  const pseudoConsole = Object.create(console);
  pseudoConsole.assert = function (assertion) {
    const args = Array.from(arguments);
    args.shift();

    assertLog.push({
      assertion: Boolean(assertion),
      messages: [...args]
    })
  }

  const logLog = [];
  pseudoConsole.log = function (assertion) {
    const args = Array.from(arguments);
    logLog.push(args)
  }

  const evaluator = new Function('console', functionBody(func));
  try {
    evaluator(pseudoConsole);
  } catch (err) {
    console.error('%c' + err.name + ': "' + err.message + '"', 'color: red', '\n  ' + func.name + ' line ' + (err.lineNumber - 3));
    renderTutorLink(func, "red");
    return err;
  }

  const mainColor = assertLog.length === 0
    ? "black"
    : assertLog.every(entry => entry.assertion)
      ? "green"
      : "orange";

  console.groupCollapsed("%c" + func.name, "color:" + mainColor);
  {
    for (let entry of assertLog) {
      entry.assertion
        ? console.log('%cPASS: ', 'color:green', ...entry.messages)
        : console.log('%cFAIL: ', 'color:orange', ...entry.messages)
    }
    if (logLog.length !== 0) {
      console.groupCollapsed('logs:');
      {
        logLog.forEach(logs => console.log(...logs));
      }
      console.groupEnd();
    }
  }
  console.groupEnd();

  renderTutorLink(func, mainColor);

  return assertLog;

  // -- factored out functions below here -- //

  function functionBody(func) {
    const funcString = func.toString();
    const bodyStart = funcString.indexOf("{") + 1;
    const bodyEnd = funcString.lastIndexOf("}");
    return funcString.substring(bodyStart, bodyEnd)
  }

  function renderTutorLink(func, color) {
    let snippet;
    try {
      const funcString = func.toString();
      const bodyStart = funcString.indexOf("{") + 1;
      const bodyEnd = funcString.lastIndexOf("}");
      snippet = js_beautify(funcString.substring(bodyStart, bodyEnd));
    } catch (err) {
      const funcString = func.toString();
      const linesArray = funcString.split("\n");
      linesArray[0] = '// ' + linesArray[0];
      linesArray[linesArray.length - 1] = '// ' + linesArray[linesArray.length - 1];
      snippet = linesArray.join("\n");
    }

    var encoded = encodeURIComponent(snippet);
    var sanitized = encoded.replace(/\(/g, '%28').replace(/\)/g, '%29');
    var deTabbed = sanitized.replace(/%09/g, '%20%20');
    const jsTutorLink = "http://www.pythontutor.com/live.html#code=" + deTabbed + "&cumulative=false&curInstr=2&heapPrimitives=nevernest&mode=display&origin=opt-live.js&py=js&rawInputLstJSON=%5B%5D&textReferences=false";

    const a = document.createElement('a');
    a.innerHTML = 'study <strong>' + func.name + '</strong> in JS Tutor';
    a.href = jsTutorLink;
    a.target = '_blank';
    a.style.color = color;

    document.body.appendChild(a);
    document.body.appendChild(document.createElement("hr"));
  }
}
