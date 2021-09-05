import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testUnaryOperatorTranslation(logger) {
	const cases = [
	{'in': 'n=not n', 'out': 'make "n not :n'},
	];
	processTranslationTestCases(cases, logger);
};