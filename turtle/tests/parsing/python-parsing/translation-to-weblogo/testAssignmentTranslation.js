import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testAssignmentTranslation(logger) {
	const cases = [
		{'in': 'x = []', 'out': 'make "x []'},
		{'in': 'x = ()', 'out': 'make "x []'},
		{'in': 'x = f()', 'out': 'make "x f'},
		{'in': 'x = xcor()', 'out': 'make "x xCor'},
		{'in': 'x = 5', 'out': 'make "x 5'},
		{'in': 'x += 5', 'out': 'make "x :x + 5'},
		{'in': 'x -= 5', 'out': 'make "x :x - 5'},
		{'in': 'x += 5 * 2', 'out': 'make "x :x + (5 * 2)'},
		{'in': 'x *= 5 * 2', 'out': 'make "x :x * (5 * 2)'},
		{'in': 'x /= 5 * 2', 'out': 'make "x :x / (5 * 2)'},
		{'in': 'x %= 5 * 2', 'out': 'make "x modulo :x 5 * 2'},
		{'in': 'x **= 5 * 2', 'out': 'make "x power :x 5 * 2'},
		{'in': 'x //= 5 * 2', 'out': 'make "x pyIDiv :x 5 * 2'},
		{'in': 'x //= (5 * 2)', 'out': 'make "x pyIDiv :x (5 * 2)'},
		{'in': 'x //= 5 + 2', 'out': 'make "x pyIDiv :x 5 + 2'},
		{'in': 'list1[0] = 5', 'out': 'setItem 1 "list1 5'},
	];
	processTranslationTestCases(cases, logger);
};