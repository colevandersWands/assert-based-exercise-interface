
{
  const pageTitle = 'invalid';
  const header = document.createElement("h2");
  header.innerHTML = pageTitle;
  document.body.appendChild(header);
  console.groupCollapsed(pageTitle);
}

const casesIsntArray = {};





const isntAFunction = 3;
function isAfunction() { };

evaluate(isntAFunction);
evaluate(isAfunction, casesIsntArray);

const caseIsntObject = [[]];
function isAfunction2() { };
evaluate(isAfunction2, caseIsntObject);

const nameIsntString = [{ name: 3, args: [], expected: null }];
function isAfunction3() { };
evaluate(isAfunction3, nameIsntString);

const argsIsntArray = [{ name: 3, args: 3, }];
function isAfunction4() { };
evaluate(isAfunction4, argsIsntArray);

const mixed = [
  { name: 3, args: 3, },
  { name: "3", args: [3], expected: undefined },
  { name: "kish", args: ["u"], expected: '<3' }
];
evaluate(function asd() { console.assert(true) }, mixed);

const emptyCases = [];
function emptyCasesYesAsserts() {
  console.assert(false, "assll1!")
}
evaluate(emptyCasesYesAsserts, emptyCases);


{
  console.groupEnd();
  document.body.appendChild(document.createElement('hr'));
}
