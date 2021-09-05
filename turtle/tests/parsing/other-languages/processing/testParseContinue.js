import { processParseTestCases } from './processParseTestCases.js';

export function testParseContinue(logger) {
	const cases = [
		{'code': `continue`, 'numTopChildren': 1},
		{'code': `continue;`, 'numTopChildren': 2},
		{'code': `while (true) {continue;}`, 'numTopChildren': 1},
	];
	processParseTestCases(cases, logger);
};