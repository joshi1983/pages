import { isNoContextValueStackPush } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isNoContextValueStackPush.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsNoContextValueStackPush(logger) {
	const cases = [
		{'code': '', 'numResults': 0},
		{'code': 'valueStack.pop()', 'numResults': 0},
		{'code': 'valueStack.length--', 'numResults': 0},
		{'code': 'context.pop()', 'numResults': 0},
		{'code': 'context.valueStack.pop()', 'numResults': 0},
		{'code': 'context.valueStack.push()', 'numResults': 0},
		{'code': 'context.valueStack.push(3)', 'numResults': 0},
		{'code': 'valueStack.push()', 'numResults': 0}, // too few parameters
		{'code': 'valueStack.push(3)', 'numResults': 1},
		{'code': 'valueStack.push(1, 2, 3)', 'numResults': 1},
	];
	processTokenCheckTests(cases, isNoContextValueStackPush, logger);
};