import { processParseTestCases } from './processParseTestCases.js';

export function testParseIf(logger) {
	const cases = [
	 {
		'code': `if $n < 10 {}`,
		'numTopChildren': 1
	}, {
		'code': `if $n < 10 {} else {}`,
		'numTopChildren': 1
	}
	];
	processParseTestCases(cases, logger);
};