
{
  const pageTitle = 'console methods';
  const header = document.createElement("h2");
  header.innerHTML = pageTitle;
  document.body.appendChild(header);
  console.groupCollapsed(pageTitle);
}

console.groupCollapsed('some docs');
{
  console.log(`evaluate() does not treat all console methods the same

it will capture and render as part of the evaluation:
.assert
.log
.dir
.dirxml
.info
.warn
.table

all other `);
}
console.groupEnd();

const consoleDir = () => {
  console.dir(document.createElement('div'));
}
evaluate(consoleDir);

const consoleDebug = () => {
  console.debug("poopo");
}
evaluate(consoleDebug);

{
  console.groupEnd();
  document.body.appendChild(document.createElement('hr'));
}
