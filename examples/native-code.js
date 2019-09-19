
{
  const pageTitle = 'native code';
  const header = document.createElement("h2");
  header.innerHTML = pageTitle;
  document.body.appendChild(header);
  console.groupCollapsed(pageTitle);
}

evaluate(Number);

const NumberCases = [
  { name: 'string: ee', args: ['ee'], expected: NaN },
  { name: 'string: 1', args: ['1'], expected: 1 },
  { name: 'string: 1.0', args: ['1.0'], expected: 1 },
  { name: 'boolean: true', args: [true], expected: 1 },
  { name: 'undefined', args: [undefined], expected: NaN },
  { name: 'null', args: [null], expected: 0 },
];
evaluate(Number, NumberCases);


const boundMapCases = [
  { name: "passing", args: [x => x + 1], expected: [1, 2] },
  { name: "failing", args: [x => x], expected: [1, 2] }
];
const boundMapBehavior = Array.prototype.map.bind([0, 1]);
evaluate(boundMapBehavior, boundMapCases);

const boundMapImplementation = Array.prototype.map.bind([0, 1]);
evaluate(boundMapImplementation);

evaluate(console.log);

evaluate(console.log, [
  { name: "empty log", args: [], expected: undefined },
  { name: "non-empty log", args: [1, "hi", null], expected: undefined },
]);



{
  console.groupEnd();
  document.body.appendChild(document.createElement('hr'));
}
