
{
  const pageTitle = 'meta';
  const header = document.createElement("h2");
  header.innerHTML = pageTitle;
  document.body.appendChild(header);
  console.groupCollapsed(pageTitle);
}

evaluate(evaluate);

evaluate(evaluate, [{ name: "behavioring implementation", args: [function behaim() { console.assert(true) }], expected: "a full log object" }]);

const funcy = x => x;
const funcyCases = [
  { name: "pass", args: [0], expected: 0 },
  { name: "fail", args: [0], expected: 1 },
];
evaluate(evaluate, [{ name: "behavioring behavior", args: [funcy, funcyCases], expected: "a full log object" }]);

{
  console.groupEnd();
  document.body.appendChild(document.createElement('hr'));
}
