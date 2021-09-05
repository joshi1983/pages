import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateBinaryOperators(logger) {
	const cases = [
		{'in': 'print x - y', 'out': 'print :x - :y'},
		{'in': 'print x + y', 'out': 'print :x + :y'},
		{'in': 'print x * y', 'out': 'print :x * :y'},
		{'in': 'print x / y', 'out': 'print :x / :y'},
		{'in': 'print x \\ y', 'outContains': 'print qbIntegerDivision :x :y'},
		{'in': 'print x and y', 'out': 'print and :x :y'},
		{'in': 'print x or y', 'out': 'print or :x :y'},
		{'in': 'print x xor y', 'out': 'print xor :x :y'},
		{'in': 'print x ^ y', 'out': 'print power :x :y'},
		{'in': 'print 4+ -2', 'out': 'print 4 - 2'},
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};