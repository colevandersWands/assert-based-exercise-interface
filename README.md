# study-function

a function that turns the browser and devtools into a study environment for javascript exercises

play with the live examples [right here](https://janke-learning.github.io/study-function/) (it's not so interesting if you don't open your devtools' debugger)


```evaluate``` will run the target function twice:
1. to build up the evaluation and know how to render the readout
1. for the ```console output:``` tab, so logs appear in order un-interupted
this is not a problem for exercises that use side-effect-less functions but will matter if multiple exercises in a row are accessing the same data.  if you're testing code that shares state, then this isn't the tool for you anyway.  you'll want a full testing framework for that

if you can think of a way to correctly color the main report log _and_ have the console output collapsed in the group, PR!



> no support for event loop exercises yet, coming soon

---

## Exercise Types:

IMPLEMENTATION
* passing a function into evaluate without any test cases will just evaluate any assert statements within the function
* these exercises are for practicing small snippets and learning how to debug, poke around, and understand memory
* implementation exercises will open up in pythontutor, since they're about how the snippet executes

BEHAVIOR
* if you pass in test cases, evaluate will run each test case and log the results (including any asserts or logs)
* if a test case is invalid the main log turns purple, the bad test case will log purple, and will log the bad test case with informative errors
* behavior exercises open in parsonizer, since they're about understanding the logic of the function
* if a behavior exercise also has asserts, it will need to pass all asserts _and_ test cases


---

Color Codings:
* ORANGE: at least one test or assert failed
* GREEN: all tests and asserts passed, and there were no invalid test cases
* RED: it threw an error
* PURPLE: there was at least one invalid test case
* BLACK: no test cases or asserts

---

### Native Function Support

this function can also be used to evaluate native JS functions, it will label them with ```(native)```

---


### Meta-Evaluation

just for fun (and to cover all cases), evaluate can evaluate itself
