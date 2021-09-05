import { mergeValueStackLastMutations } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/mergeValueStackLastMutations.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testMergeValueStackLastMutations(logger) {
	const cases = [
	{'in': '', 'changed': false},
	{'in': `context.valueStack[context.valueStack.length - 1] = context.valueStack[context.valueStack.length - 1] * 0.01;
context.valueStack[context.valueStack.length - 1] = 4;`,
'out': `context.valueStack[context.valueStack.length - 1] = 4
 ;`
},
	{'in': `context.valueStack.push("v",10,context.globalVariables.get("x"));
context.valueStack[context.valueStack.length - 1] = context.valueStack[context.valueStack.length - 1] * 0.01 ;`,
'out': `context.valueStack.push("v",10,context.globalVariables.get("x")*0.01 )
 ;`
},
	{'in': `context.valueStack.push(context.globalVariables.get("x"));
context.valueStack[context.valueStack.length - 1] = context.valueStack[context.valueStack.length - 1] * 0.01 ;`,
'out': `context.valueStack.push(context.globalVariables.get("x")*0.01 )
 ;`
},
	{'in': `context.valueStack.push(4);
context.valueStack[context.valueStack.length - 1] = context.valueStack[context.valueStack.length - 1] * 0.01 ;`,
'out': `context.valueStack.push(4*0.01 )
 ;`
},
{'in': `context.localmake("angle",1);
context.valueStack.push("distance",context.readVariable("width"),context.readVariable("height"),context.readVariable("angle") );
context.valueStack[context.valueStack.length - 1] = context.valueStack[context.valueStack.length - 1] + 1 ;`,
'out': `context.localmake("angle",1);
context.valueStack.push("distance",context.readVariable("width"),context.readVariable("height"),context.readVariable("angle")+1 )
 ;`
},
{'in': `context.valueStack[context.valueStack.length - 0] = context.repcount();
context.valueStack.push(1);
context.valueStack[context.valueStack.length - 2] = context.valueStack[context.valueStack.length - 2] - context.valueStack[context.valueStack.length - 1];
context.valueStack.pop();
context.valueStack.push(2);
context.valueStack[context.valueStack.length - 2] = context.valueStack[context.valueStack.length - 2] / context.valueStack[context.valueStack.length - 1];
context.valueStack.pop();`,
'out': `context.valueStack[context.valueStack.length - 0] = context.repcount();
context.valueStack.push(1);
context.valueStack[context.valueStack.length - 2] = context.valueStack[context.valueStack.length - 2] - context.valueStack[context.valueStack.length - 1];
context.valueStack.pop();
context.valueStack.push(2);
context.valueStack[context.valueStack.length - 2] = context.valueStack[context.valueStack.length - 2] / context.valueStack[context.valueStack.length - 1];
context.valueStack.pop();`}
	];
	testInOutPairs(cases, mergeValueStackLastMutations, logger);
};