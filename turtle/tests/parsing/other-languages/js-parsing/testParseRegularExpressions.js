import { processParseTestCases } from './processParseTestCases.js';

export function testParseRegularExpressions(logger) {
	const cases = [
		{'code': 'if (/\s/g.test(c)) {}', 'numTopChildren': 1}
	];
	processParseTestCases(cases, logger);
};
