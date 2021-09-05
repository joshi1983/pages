import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testWhileLoopTranslation(logger) {
	const cases = [
		{'in': 'while True:\n\tprint("hi")', 'out': 'forever [\n\nprint "hi \n]'},
		{'in': 'while x:\n\tprint("hi")', 'out': 'while :x [\n\nprint "hi \n]'},
		{'in': 'while x < 4:\n\tprint("hi")\n\tx += 1',
			'out': 'while :x < 4 [\n\nprint "hi \nmake "x :x + 1\n\n]'},
		{'in': 'while x < 1:\n\tx += 1\nelse:\n\tprint("bye")',
			'out': 'while :x < 1 [\n\nmake "x :x + 1\n\n]\n\nprint "bye'},
		{'in': 'while x < 1:\n\tx += 1\n\tbreak\nelse:\n\tprint("bye")',
			'out': 'while :x < 1 [\n\nmake "x :x + 1\n break \n]\nif not (:x < 1) [\n\nprint "bye \n]'},
	];
	processTranslationTestCases(cases, logger);
};