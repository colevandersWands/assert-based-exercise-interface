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
];
function errorsOut(x) {
  if (x === "hi!") {
    console.log("errored")
    throw new Error("hello!");
  }
  console.assert(true, "no error")
  return x;
}
evaluate(errorsOut, errorsCases);


const passCases = [
  { name: 'first', args: [0], expected: 0 },
  { name: 'second', args: ["hi!"], expected: "hi!" },
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

console.groupEnd();
