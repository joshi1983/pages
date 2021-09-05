import { isComplexNumberLiteral } from
'../../../../modules/parsing/python-parsing/scanning/isComplexNumberLiteral.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsComplexNumberLiteral(logger) {
	const cases = [
		{'in': '1', 'out': false},
		{'in': '1.3', 'out': false},
		{'in': '2+4j', 'out': false},
		// Although, 2+4j is a complex number, we don't want isComplexNumberLiteral to return true for a complete expression.
		// The larger expressions can be represented by multiple nodes in the corresponding parse tree.
		
		{'in': '4j', 'out': true},
		{'in': '2j', 'out': true},
		{'in': '.14j', 'out': true},
		{'in': '3.14j', 'out': true},
		{'in': '-2j', 'out': true},
		{'in': '-3.14j', 'out': true},
		{'in': '-.14j', 'out': true},
	];
	testInOutPairs(cases, isComplexNumberLiteral, logger);
};