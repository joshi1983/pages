import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testBinaryOperatorTranslation(logger) {
	const cases = [
		{'in': 'x%y', 'out': '(modulo :x :y)'},
		{'in': 'x%(y)', 'out': '(modulo :x (:y))'},
		{'in': 'x%-(y)', 'out': '(modulo :x -(:y))'},
	];
	processTranslationTestCases(cases, logger);
};