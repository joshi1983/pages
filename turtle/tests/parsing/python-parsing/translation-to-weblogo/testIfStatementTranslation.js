import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testIfStatementTranslation(logger) {
	const cases = [
		{'in': 'if True:\n\tprint("hi")', 'out': 'if true [\n\nprint "hi \n]'},
		{'in': 'if True:\n\tprint("hi") \nelse:\n\tprint("bye")',
			'out': 'ifelse true [\n\nprint "hi \n] [\n\nprint "bye \n]'},
		{'in': 'if b > a:\n\tprint("case1")\nelif a == b:\n\tprint("case2")',
			'out': 'ifelse :b > :a [\n\nprint "case1 \n] [\nif :a = :b [\n\nprint "case2 \n]\n]'},
		{'in': 'if b > a:\n\tprint("case1")\nelif a == b:\n\tprint("case2")\nelse:\n\tprint("case3")',
			'out': 'ifelse :b > :a [\n\nprint "case1 \n] [\nifelse :a = :b [\n\nprint "case2 \n] [\n\nprint "case3 \n]\n]'},
		{'in': 'if abs(pos()) < 1:\n\tbreak',
			'out': 'if (hypot pos ) < 1 [\n break \n]'},
		{'in': 'if abs(pos()) < 1:\n\tcontinue',
			'out': 'if (hypot pos ) < 1 [\n continue \n]'},
	];
	processTranslationTestCases(cases, logger);
};