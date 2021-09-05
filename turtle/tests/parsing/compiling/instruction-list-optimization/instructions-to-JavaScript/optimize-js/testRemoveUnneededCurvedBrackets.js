import { removeUnneededCurvedBrackets } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/removeUnneededCurvedBrackets.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testRemoveUnneededCurvedBrackets(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': '1', 'out': '1'},
		{'in': '1+2', 'out': '1+2'},
		{'in': '(2+3)*4', 'out': '(2+3)*4'},
		{'in': '(1)', 'out': '1'},
		{'in': '(true)', 'out': 'true'},
		{'in': '("hi")', 'out': '"hi"'},
		{'in': '(f())', 'out': 'f()'},
		{'in': '-(f())', 'out': '- f()'},
		{'in': '-(context.globalVariables.get("x"))', 'out': '- context.globalVariables.get("x")'},
		{'in': 'context.turtle.setPenSize(this.validateNumber(this.errorCaseCheck6(0)))',
		'out': 'context.turtle.setPenSize(this.validateNumber(this.errorCaseCheck6(0)))'}
	];
	testInOutPairs(cases, removeUnneededCurvedBrackets, logger);
};