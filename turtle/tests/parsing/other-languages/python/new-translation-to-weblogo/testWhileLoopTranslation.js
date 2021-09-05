import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testWhileLoopTranslation(logger) {
	const cases = [
		{'in': 'while True:\n\tprint("hi")', 'out': 'forever [\n\tprint "hi\n]'},
		{'in': 'while x:\n\tprint("hi")', 'out': 'while :x [\n\tprint "hi\n]'},
		{'in': 'while x < 4:\n\tprint("hi")\n\tx += 1',
			'out': 'while :x < 4 [\n\tprint "hi\n\tmake "x :x + 1\n]'},
		{'in': 'while x < 1:\n\tx += 1\nelse:\n\tprint("bye")',
			'out': 'while :x < 1 [\n\tmake "x :x + 1\n]\nprint "bye'},
		{'in': 'while x < 1:\n\tx += 1\n\tbreak\nelse:\n\tprint("bye")',
			'out': 'while :x < 1 [\n\tmake "x :x + 1\n\tbreak\n]\nif not ( :x < 1 ) [\n\tprint "bye\n]'},
	];
	processTranslationTestCases(cases, logger);
};