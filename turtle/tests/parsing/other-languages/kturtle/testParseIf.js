import { processParseTestCases } from './processParseTestCases.js';

export function testParseIf(logger) {
	const cases = [
	 {
		'code': `if $n < 10 {}`,
		'numTopChildren': 1
	}, {
		'code': `if $n < 10 {} else {}`,
		'numTopChildren': 1
	}, {
		'code': `if $n < 10 {} forward 100`,
		'numTopChildren': 2
	}, {
		'code': `if $n < 10 {}  for $y = 2 to 20 {}`,
		'numTopChildren': 2
	}, {
		'code': `if $n < 10 {} repeat 2 {}`,
		'numTopChildren': 2
	}, {
		'code': `if $n < 10 {} while $x < 2 {}`,
		'numTopChildren': 2
	}, {
		'code': `if $n < 10 {} else {} forward 100`,
		'numTopChildren': 2
	}, {
		'code': `if $n < 10 {} else {} for $y = 2 to 20 {}`,
		'numTopChildren': 2
	}, {
		'code': `if $n < 10 {} else {} repeat 2 {}`,
		'numTopChildren': 2
	}, {
		'code': `if $n < 10 {} else {} while $x < 2 {}`,
		'numTopChildren': 2
	}];
	processParseTestCases(cases, logger);
};