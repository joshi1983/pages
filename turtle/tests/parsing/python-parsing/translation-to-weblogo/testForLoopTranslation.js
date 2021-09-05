import { processTranslationTestCase } from './processTranslationTestCase.js';

export function testForLoopTranslation(logger) {
	const cases = [
		{'in': 'for i in range(4):\n\tstar.right(144)', 'out': 'repeat 4 [\n\nright 144 \n]'},
		{'in': 'for i in range(0, 4):\n\tstar.right(144)', 'out': 'repeat 4 [\n\nright 144 \n]'},
		{'in': 'for i in range(0, 4, 1):\n\tstar.right(144)', 'out': 'repeat 4 [\n\nright 144 \n]'},
		{'in': 'for i in range(0, 16, 1):\n\tstar.right(144)', 'out': 'repeat 16 [\n\nright 144 \n]'},
		{'in': 'for i in range(0, 16, 2):\n\tstar.right(144)', 'out': 'repeat 8 [\n\nright 144 \n]'},
		{'in': 'for i in range(2):\n\tprint(str(i))', 'out': 'for ["i 0 1] [\n\nprint str :i  \n]'},
		{'in': 'for i in range(x):\n\tprint("hi")', 'out': 'repeat :x [\n\nprint "hi \n]'},
		{'in': 'for i in range(0, x):\n\tprint("hi")', 'out': 'repeat :x [\n\nprint "hi \n]'},
		{'in': 'for i in range(1, x):\n\tprint("hi")', 'out': 'repeat :x - 1 [\n\nprint "hi \n]'},
		{'in': 'for item in list2:\n\tprint(item)',
			'out': 'repeat count :list2 [\nmake "item item repcount :list2\n\nprint :item \n]'},
		{'in': 'def f():\n\tfor item in list2:\n\t\tprint(item)\n\nf()',
			'out': 'to f\n\n\nrepeat count :list2 [\nlocalmake "item item repcount :list2\n\nprint :item \n]\n\n\nend\nf'},
			// use localmake within procedure definition.
		{'in': 'for i in range(1, n + 1, 1):\n\tprint(r * i)',
			'out': 'for ["i 1 :n ] [\n\nprint :r * :i \n]'},
		{'in': 'for i in range(1, n + 1, 2):\n\tprint(r * i)',
			'out': 'for ["i 1 :n + 1 - 2 2] [\n\nprint :r * :i \n]'},
		{'in': 'for i in range(2):\n\tprint("hi")\nelse:\n\tprint("done")', 'out': 'repeat 2 [\n\nprint "hi \n]\nprint "done'},
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTranslationTestCase(caseInfo, logger);
	});
};