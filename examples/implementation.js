
{
  const pageTitle = 'implementation';
  const header = document.createElement("h2");
  header.innerHTML = pageTitle;
  document.body.appendChild(header);
  console.groupCollapsed(pageTitle);
}

function example1_allAssertsPass() {
  console.assert(true, "first assert");
  console.assert(0 === 0, "second assert");
  console.assert("truthy statement", "third assert");
}
evaluate(example1_allAssertsPass);


function example2_allAssertsFail() {
  console.assert(false, "first assert");
  console.assert(0 !== 0, "second assert");
  console.assert("", "third assert");
}
evaluate(example2_allAssertsFail);


function example3_mixPassFail() {
  console.assert(false, "first assert");
  console.assert(0 === 0, "second assert");
  console.assert("hi!", "third assert");
}
evaluate(example3_mixPassFail);


function example4_consoleLogs() {
  const msg = "console logs appear in order";
  console.log(msg);
  console.assert(msg, "msg is not an empty string");

  const msg2 = "collapsed below all assert statements";
  console.assert(msg2, "msg2 is not an empty string");
  console.log(msg2);
}
evaluate(example4_consoleLogs);


function example5_noAsserts() {
  const msg = "no asserts? report is black!";
  console.log(msg);
  const msg2 = "and logs are not collapsed";
  console.log(msg2);
}
evaluate(example5_noAsserts);


function example6_runtimeError() {
  console.assert(true, "adfasd")
  console.log("ew")
  const x = 4;
  x();
}
evaluate(example6_runtimeError);


function example7_returnsAreIgnored() {
  const x = 4, y = 5;
  console.assert(x !== y, "x and y are not the same");

  const a = 9;
  console.assert(a === (x + y), "a is the sum of x & y");

  return a;
}
evaluate(example7_returnsAreIgnored);


function example8_resultIs5passing() {
  let result = 0;
  for (let x = 0; x < 6; x++) {
    console.log(x);
    result = x;
  }
  console.assert(result === 5, "result: ", typeof result, result);
}
evaluate(example8_resultIs5passing);

function example8_resultIs5failing() {
  let result = 0;
  for (let x = 0; x < 5; x++) {
    console.log(x);
    result = x;
  }
  console.assert(result === 5, "result: ", typeof result, result);
}
evaluate(example8_resultIs5failing);



{
  console.groupEnd();
  document.body.appendChild(document.createElement('hr'));
}
