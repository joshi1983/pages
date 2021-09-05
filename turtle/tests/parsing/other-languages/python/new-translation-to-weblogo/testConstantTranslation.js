import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testConstantTranslation(logger) {
	const cases = [
		{'in': 'import math\nprint math.pi', 'out': 'print pi'},
		{'in': 'import math\nprint math.e', 'out': 'print 2.718281828459045'},
		{'in': 'import math\nprint math.tau', 'out': 'print 6.283185307179586'},
	];
	processTranslationTestCases(cases, logger);
};