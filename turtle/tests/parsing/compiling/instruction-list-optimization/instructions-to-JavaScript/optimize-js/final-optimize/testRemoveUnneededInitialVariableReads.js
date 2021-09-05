import { removeUnneededInitialVariableReads } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/final-optimize/removeUnneededInitialVariableReads.js';
import { testInOutPairs } from
'../../../../../../helpers/testInOutPairs.js';

export function testRemoveUnneededInitialVariableReads(logger) {
	const cases = [
	{'in': '', 'changed': false},
	{'in': 'let x = 3;', 'changed': false},
	{'in': 'let x += context.readVariable("x");', 'changed': false},
	{'in': `let x = context.readVariable("x");
context.turtle.print(x)`,
	'changed': false},
	{'in': `let x = context.globalVariables.get("x");
context.turtle.print(x)`,
	'changed': false},
	{'in': 'let x = context.readVariable("x");',
	'out': `let x ;`},
	{'in': 'let x = localVariables.get("x");',
	'out': `let x ;`},
	{'in': 'let x = context.globalVariables.get("x");',
	'out': `let x ;`},
	{'in': `let x = context.readVariable("x");
x=4;
context.turtle.print(x)`,
	'out': `let x ;
x=4;
context.turtle.print(x)`},
	];
	testInOutPairs(cases, removeUnneededInitialVariableReads, logger);
};