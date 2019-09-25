
{
  const pageTitle = 'quizzing';
  const header = document.createElement("h2");
  header.innerHTML = pageTitle;
  document.body.appendChild(header);
  console.groupCollapsed(pageTitle);
}

// setting .quizzing on a function to true will hide the return value unless the test is passed

const mysteryThreeTests = [
  { name: 'first', args: [1], expected: 1 },
  { name: 'second', args: [5], expected: 8 },
  { name: 'third', args: [5], expected: 7 },
];
function mysteryThree(x) {
  const sum = (a, b) => a + b
  const diff = (a, b) => a - b;
  return x <= 1 ? 1 : sum(mysteryThree(diff(x, 1)), mysteryThree(diff(x, 2)));
}
mysteryThree.quizzing = true;
evaluate(mysteryThree, mysteryThreeTests);

const typeTesterTests = [
  { name: 'first', args: [4], expected: '4 is a number' },
  { name: 'second', args: [NaN], expected: 'NaN is a number' },
  { name: 'third', args: ['4'], expected: '4 is a string' },
  { name: 'fourth', args: [undefined], expected: 'undefined is undefined' },
  { name: 'fifth', args: [null], expected: 'null is null' },
  { name: 'sixth', args: [true], expected: 'true is a boolean' },
  { name: 'seventh', args: [null], expected: 'Infinity is a number' },
];
function typeTester(value) {
  // write this!
}
typeTester.quizzing = true;
evaluate(typeTester, typeTesterTests);



{
  console.groupEnd();
  document.body.appendChild(document.createElement('hr'));
}
