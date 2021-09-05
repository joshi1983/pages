import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testTranslateImportStatements(logger) {
	const cases = [
		{'in': `from turtle import *
		from colorsys import *`,
		'out': ''
		}
	];
	processTranslationTestCases(cases, logger);
};