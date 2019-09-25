/*
  create examples with mix of
    good/bad test cases
    pass/fail test cases
    absolute/mixed

  logs and asserts will behave as in implementation exercises

*/
{
  const pageTitle = 'behavior';
  const header = document.createElement("h2");
  header.innerHTML = pageTitle;
  document.body.appendChild(header);
  console.groupCollapsed(pageTitle);
}

const errorsCases = [
  { name: 'first', args: [0], expected: 0 },
  { name: 'second', args: ["hi!"], expected: "hi!" },
  { name: 'third', args: [0], expected: 1 },
  { name: 'fourth', args: ["hi"], expected: "no" },
];
function errorsOut(x) {
  console.log(x)
  if (x === "hi!") {
    console.log("errored")
    throw new Error("hello!");
  }
  else if (x === 'hi') {
    throw new TypeError("strings don't exist");
  }
  console.assert(true, "no error")
  return x;
}
evaluate(errorsOut, errorsCases);


const passCases = [
  { name: 'first', args: [0, 1, "E"], expected: 0 },
  { name: 'second', args: ["hi!", 4, null], expected: "hi!" },
  { name: 'third', args: [1], expected: 1 },
];
function passFunc(x) {
  return x;
}
evaluate(passFunc, passCases);


const failCases = [
  { name: 'first', args: [0], expected: 1 },
  { name: 'second', args: ["hi!"], expected: "hi" },
  { name: 'third', args: [1], expected: 0 },
];
function failFunc(x) {
  return x;
}
evaluate(failFunc, failCases);


const noCases = [
];
function noFunc(x) {
  console.log("asdf")
  console.assert("false", false)
  return x;
}
evaluate(noFunc, noCases);


const memeCases = [
  { name: 3, args: [0], expected: 0 },
  { name: '3', args: [0], expected: 0 },
];
function noFunc2(x) {
  console.log("asdf")
  console.assert("false", false)
  return x;
}
evaluate(noFunc2, memeCases);


const argumentsObjectCases = [
  { name: 'numbers', args: [0, 1, 2], expected: undefined },
  { name: 'letters', args: ['a', 'b', 'c'], expected: undefined },
];
function argumentsObject() {
  console.log(...Array.from(arguments));
}
evaluate(argumentsObject, argumentsObjectCases);


{
  console.groupEnd();
  document.body.appendChild(document.createElement('hr'));
}
