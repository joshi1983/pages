import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testAssignmentTranslation(logger) {
	const cases = [
		{'in': 'x = []', 'out': 'make "x [ ]'},
		{'in': 'x = ()', 'out': 'make "x [ ]'},
		{'in': 'x = f()', 'out': 'make "x f'},
		{'in': 'x = xcor()', 'out': 'make "x xCor'},
		{'in': 'x = 5', 'out': 'make "x 5'},
		{'in': 'x += 5', 'out': 'make "x :x + 5'},
		{'in': 'x -= 5', 'out': 'make "x :x - 5'},
		{'in': 'x += 5 * 2', 'out': 'make "x :x + ( 5 * 2 )'},
		{'in': 'x *= 5 * 2', 'out': 'make "x :x * ( 5 * 2 )'},
		{'in': 'x /= 5 * 2', 'out': 'make "x :x / ( 5 * 2 )'},
		{'in': 'x %= 5 * 2', 'out': 'make "x modulo :x 5 * 2'},
		{'in': 'x **= 5 * 2', 'out': 'make "x power :x 5 * 2'},
		{'in': 'x //= 5 * 2', 'out': 'make "x pyIDiv\n:x 5 * 2'},
		{'in': 'x //= (5 * 2)', 'out': 'make "x pyIDiv\n:x ( 5 * 2 )'},
		{'in': 'x //= 5 + 2', 'out': 'make "x pyIDiv\n:x 5 + 2'},
		{'in': 'list1[0] = 5', 'out': 'setItem 1 "list1 5'},
		{'in': 'WIDTH, HEIGHT = 1600, 900',
'out': `make "WIDTH 1600
make "HEIGHT 900`},
{'in': 'x, y, z = 1, 2, 3',
'out': `make "x 1
make "y 2
make "z 3`},
	{'in': 'x, y, z = t',
	'out': `make "x first :t
make "y item 2 :t
make "z item 3 :t`},
	{'in': '[x, y, z] = t',
	'out': `make "x first :t
make "y item 2 :t
make "z item 3 :t`},
	];
	processTranslationTestCases(cases, logger);
};