
{
  const pageTitle = 'invalid';
  const header = document.createElement("h2");
  header.innerHTML = pageTitle;
  document.body.appendChild(header);
  console.groupCollapsed(pageTitle);
}

const casesIsntArray = {};
const caseIsntObject = [[]];
const nameIsntString = [{ name: 3, args: [], expected: null }];
const argsIsntArray = [{ name: 3, args: 3, }];
const mixed = [
  { name: 3, args: 3, },
  { name: "kish", args: ["u"], expected: '<3' }
];

const isntAFunction = 3;
function isAfunction() { };

evaluate(isntAFunction);
evaluate(isAfunction, casesIsntArray);
evaluate(isAfunction, caseIsntObject);
evaluate(isAfunction, nameIsntString);
evaluate(isAfunction, argsIsntArray);
evaluate(function asd() { console.assert(true) }, mixed);

const emptyCases = [];
function emptyCasesYesAsserts() {
  console.assert(false, "assll1!")
}
evaluate(emptyCasesYesAsserts, emptyCases);

console.groupEnd();
