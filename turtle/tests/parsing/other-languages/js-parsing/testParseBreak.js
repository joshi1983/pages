import { processParseTestCases } from './processParseTestCases.js';

export function testParseBreak(logger) {
	const cases = [
		{'code': `break`, 'numTopChildren': 1},
		{'code': `break;`, 'numTopChildren': 2},
		{'code': `while (true) {break;}`, 'numTopChildren': 1},
	];
	processParseTestCases(cases, logger);
};