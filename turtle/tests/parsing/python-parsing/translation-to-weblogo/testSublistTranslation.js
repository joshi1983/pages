import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testSublistTranslation(logger) {
	const cases = [
		{'in': 'print(["a", "b", "c"])', 'out': 'print ["a "b "c]'},
		{'in': 'print([1,2][x])', 'out': 'print  item 1 + :x [1 2]'},
		{'in': 'print [1,2][x]', 'out': 'print item 1 + :x [1 2]'},
		{'in': 'print(["a", "b", "c"][1:])', 'out': 'print  sublist ["a "b "c] 2  0'},
		{'in': 'print(["a", "b", "c"][1:-1])', 'out': 'print  sublist ["a "b "c] 2  0'},
		{'in': 'print(["a", "b", "c"][2:-1])', 'out': 'print  sublist ["a "b "c] 3  0'},
		{'in': 'print(["a", "b", "c"][:1])', 'out': 'print  sublist ["a "b "c] 1 2'},
		{'in': 'print(["a", "b", "c"][0:1])', 'out': 'print  sublist ["a "b "c] 1  2'},
		{'in': 'print(["a", "b", "c"][0:x])', 'out': 'print  sublist ["a "b "c] 1  1 + :x'},
		{'in': 'print(["a", "b", "c"][x:])', 'out': 'print  sublist ["a "b "c] 1 + :x  0'},
	];
	processTranslationTestCases(cases, logger);
};