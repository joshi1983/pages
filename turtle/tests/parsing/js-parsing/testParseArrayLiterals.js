import { processParseTestCases } from './processParseTestCases.js';

export function testParseArrayLiterals(logger) {
	const cases = [
	{'code': `function f() {
}
['change'].forEach`, 'numTopChildren': 2},
	{'code': '[[20,1.8265],[-202.7,0.29224]]', 'numTopChildren': 1},
	{'code': `const x = []
const y = 2`, 'numTopChildren': 2}
];
	processParseTestCases(cases, logger);
};