import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testForLoopTranslation(logger) {
	const cases = [
		{'in': 'for i in range(4):\n\tstar.right(144)', 'out': 'repeat 4 [\n\tright 144\n]'},
		{'in': 'for i in range(0, 4):\n\tstar.right(144)', 'out': 'repeat 4 [\n\tright 144\n]'},
		{'in': 'for i in range(0, 4, 1):\n\tstar.right(144)', 'out': 'repeat 4 [\n\tright 144\n]'},
		{'in': 'for i in range(0, 16, 1):\n\tstar.right(144)', 'out': 'repeat 16 [\n\tright 144\n]'},
		{'in': 'for i in range(0, 16, 2):\n\tstar.right(144)', 'out': 'repeat 8 [\n\tright 144\n]'},
		{'in': 'for i in range(2):\n\tprint(str(i))', 'out': 'for [ "i 0 1 ] [\n\tprint str :i\n]'},
		{'in': 'for i in range(x):\n\tprint("hi")', 'out': 'repeat :x [\n\tprint "hi\n]'},
		{'in': 'for i in range(0, x):\n\tprint("hi")', 'out': 'repeat :x [\n\tprint "hi\n]'},
		{'in': 'for i in range(1, x):\n\tprint("hi")', 'out': 'repeat :x - 1 [\n\tprint "hi\n]'},
		{'in': 'for item in list2:\n\tprint(item)',
			'out': 'repeat count :list2 [\n\tmake "item item repcount :list2\n\tprint :item\n]'},
		{'in': 'def f():\n\tfor item in list2:\n\t\tprint(item)\n\nf()',
			'out': 'to f\n\trepeat count :list2 [\n\t\tlocalmake "item item repcount :list2\n\t\tprint :item\n\t]\nend\n\nf'},
			// use localmake within procedure definition.
		{'in': 'for i in range(1, n + 1, 1):\n\tprint(r * i)',
			'out': 'for [ "i 1 :n ] [\n\tprint :r * :i\n]'},
		{'in': 'for i in range(1, n + 1, 2):\n\tprint(r * i)',
			'out': 'for [ "i 1 :n + 1 - 2 2 ] [\n\tprint :r * :i\n]'},
		{'in': 'for i in range(2):\n\tprint("hi")\nelse:\n\tprint("done")', 'out': 'repeat 2 [\n\tprint "hi\n]\nprint "done'},
		{'in': 'for i in [20, 40, 60]:\n\tstar.right(i)',
		'out': 'make "i_ [ 20 40 60 ]\nrepeat count :i_ [\n\tmake "i item repcount :i_\n\tright :i\n]'},
	];
	processTranslationTestCases(cases, logger);
};