import { isDecoratorStart } from
'../../../../modules/parsing/python-parsing/scanning/isDecoratorStart.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testIsDecoratorStart(logger) {
	const cases = [
		{'in': '2', 'out': false},
		{'in': '2.32', 'out': false},
		{'in': '-2.32', 'out': false},
		{'in': 'a', 'out': false},
		{'in': '@', 'out': true},
		{'in': '@a', 'out': true},
		{'in': '@staticmethod', 'out': true}
	];
	testInOutPairs(cases, isDecoratorStart, logger);
};