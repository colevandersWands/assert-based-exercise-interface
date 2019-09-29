console.groupCollapsed('domless');
{

  console.log('students can also use evaluate to test functions used in projects without cluttering the dom');

  const mixedCases = [
    { name: 'first', args: [0], expected: 0 },
    { name: 'second', args: [0], expected: 0 },
    { name: 'third', args: [0], expected: 0 },
  ];
  function passTestsPassAsserts(x) {
    console.assert(x === 0, "assert");
    console.log("asdfs")
    return x;
  }
  evaluate(passTestsPassAsserts, mixedCases);

  function failTestsPassAsserts(x) {
    console.assert(x === 0, "assert");
    console.log("asdfs")
    return x + 1;
  }
  evaluate(failTestsPassAsserts, mixedCases);

  function failTestsFailAsserts(x) {
    console.assert(x === 1, "assert");
    console.log("asdfs")
    return x + 1;
  }
  evaluate(failTestsFailAsserts, mixedCases);

  function passTestsFailAsserts(x) {
    console.assert(x === 1, "assert");
    console.log("asdfs")
    return x;
  }
  evaluate(passTestsFailAsserts, mixedCases);

}
console.groupEnd();
