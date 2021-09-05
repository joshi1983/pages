import { removeUnneededCurvedBrackets } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/removeUnneededCurvedBrackets.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testRemoveUnneededCurvedBrackets(logger) {
	const cases = [
		{'in': '', 'changed': false},
		{'in': '1', 'changed': false},
		{'in': '1+2', 'changed': false},
		{'in': '(2+3)*4', 'changed': false},
		{'in': '(1)', 'out': '1'},
		{'in': '(true)', 'out': 'true'},
		{'in': '("hi")', 'out': '"hi"'},
		{'in': '(f())', 'out': 'f()'},
		{'in': '-(f())', 'out': '- f()'},
		{'in': '-(context.globalVariables.get("x"))', 'out': '- context.globalVariables.get("x")'},
		{'in': 'context.turtle.setPenSize(this.validateNumber(this.errorCaseCheck6(0)))',
		'changed': false},
		{'in': `if (context.valueStack.pop()) {
context.turtle.print(1);
}`, 'changed': false},
		{'in': `if (context.valueStack.pop()) {
context.turtle.print(1);
} else {
console.log("hi");
}`, 'changed': false},
		{'in': `while (true) {
context.turtle.print(1);
}`, 'changed': false},
		{'in': `for (let i = 0; i < 3; i++) {
context.turtle.print(1);
}`, 'changed': false},
		{'in': `do {
context.turtle.print(1);
} while (true);`, 'changed': false},
		{'in': `switch (4) {
case 3: console.log("hi");
}`, 'changed': false}
	];
	testInOutPairs(cases, removeUnneededCurvedBrackets, logger);
};