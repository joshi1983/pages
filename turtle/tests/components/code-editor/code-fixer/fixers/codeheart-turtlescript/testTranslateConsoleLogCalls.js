import { processTranslateTestCases } from './processTranslateTestCases.js';

export function testTranslateConsoleLogCalls(logger) {
	const cases = [
		{'in': 'console.log(getX());', 'out': 'print xCor'},
		{'in': 'console.log(getY());', 'out': 'print yCor'},
	];
	processTranslateTestCases(cases, logger);
};