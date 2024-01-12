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
'out': `context.valueStack.push("v",10,context.globalVariables.get("x") * 0.01);`
},/*
	{'in': `context.valueStack.push(context.globalVariables.get("x"));
context.valueStack[context.valueStack.length - 1] = context.valueStack[context.valueStack.length - 1] * 0.01 ;`,
'out': `context.valueStack.push(context.globalVariables.get("x") * 0.01);`
},
	{'in': `context.valueStack[context.valueStack.length - 1] = 4;
context.valueStack[context.valueStack.length - 1] = context.valueStack[context.valueStack.length - 1] * 0.01 ;`,
'out': `context.valueStack.push(4 * 0.01);`
}*/
	];
	testInOutPairs(cases, mergeValueStackLastMutations, logger);
};