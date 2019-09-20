
{
  const pageTitle = 'implementation';
  const header = document.createElement("h2");
  header.innerHTML = pageTitle;
  document.body.appendChild(header);
  console.groupCollapsed(pageTitle);
}

function example1_allAssertsPass() {
  console.assert(true, "first assert", ['array much?']);
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


function example4_referenceTypeAsserts() {
  console.assert([], "empty array");
  console.assert(['hi!'], "non-empty array");
  console.assert({}, "empty object");
  console.assert({ hi: '!' }, "non-empty object");
}
evaluate(example4_referenceTypeAsserts);


function example5_consoleLogs() {
  const msg = "console logs appear in order";
  console.log(msg);
  console.assert(msg, "msg is not an empty string");

  const msg2 = "collapsed below all assert statements";
  console.assert(msg2, "msg2 is not an empty string");
  console.log(msg2);
}
evaluate(example5_consoleLogs);


function example6_noAsserts() {
  const msg = "no asserts? report is black!";
  console.log(msg);
  const msg2 = "and logs are not collapsed";
  console.log(msg2);
}
evaluate(example6_noAsserts);


function example7_runtimeError() {
  console.assert(true, "adfasd")
  console.log("ew")
  const x = 4;
  x();
}
evaluate(example7_runtimeError);


function example8_returnsAreIgnored() {
  const x = 4, y = 5;
  console.assert(x !== y, "x and y are not the same");

  const a = 9;
  console.assert(a === (x + y), "a is the sum of x & y");

  return a;
}
evaluate(example8_returnsAreIgnored);


function example9_resultIs5passing() {
  let result = 0;
  for (let x = 0; x < 6; x++) {
    console.log(x);
    result = x;
  }
  console.assert(result === 5, "result: ", typeof result, result);
}
evaluate(example9_resultIs5passing);

function example10_resultIs5failing() {
  let result = 0;
  for (let x = 0; x < 5; x++) {
    console.log(x);
    result = x;
    console.count('is 5')
    console.count('is 5 failing')
    if (x === 3) {
      console.countReset('is 5')
    }
  }
  console.assert(result === 5, "result: ", typeof result, result);
}
evaluate(example10_resultIs5failing);



{
  console.groupEnd();
  document.body.appendChild(document.createElement('hr'));
}
