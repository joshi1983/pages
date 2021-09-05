import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testTranslateStringLiteral(logger) {
	const cases = [
		{'in': "fillcolor('black')", 'outContains': '"black'},
		{'in': "fillcolor(\"black\")", 'outContains': '"black'},
		{'in': "print('Hello World')", 'outContains': '\'Hello World\''}
	];
	processTranslationTestCases(cases, logger);
};