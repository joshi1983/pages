import { isContextValueStackPush } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isContextValueStackPush.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsContextValueStackPush(logger) {
	const cases = [
		{'code': '', 'numResults': 0},
		{'code': 'valueStack.pop()', 'numResults': 0},
		{'code': 'valueStack.length--', 'numResults': 0},
		{'code': 'context.pop()', 'numResults': 0},
		{'code': 'context.valueStack.pop()', 'numResults': 0},
		{'code': 'context.valueStack.push()', 'numResults': 0},// too few parameters
		{'code': 'context.valueStack.push(3)', 'numResults': 1},
		{'code': 'context.valueStack.push(1, 2, 3)', 'numResults': 1},
		{'code': 'valueStack.push()', 'numResults': 0}, 
		{'code': 'valueStack.push(3)', 'numResults': 0},
		{'code': 'valueStack.push(1, 2, 3)', 'numResults': 0},
	];
	processTokenCheckTests(cases, isContextValueStackPush, logger);
};