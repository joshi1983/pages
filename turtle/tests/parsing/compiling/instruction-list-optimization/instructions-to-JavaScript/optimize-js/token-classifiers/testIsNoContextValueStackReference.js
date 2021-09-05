import { isNoContextValueStackReference } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isNoContextValueStackReference.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsNoContextValueStackReference(logger) {
	const cases = [
		{'code': '', 'numResults': 0},
		{'code': 'valueStack', 'numResults': 1},
		{'code': 'valueStack.pop()', 'numResults': 1},
		{'code': 'valueStack.length--', 'numResults': 1},
		{'code': 'context.pop()', 'numResults': 0},
		{'code': 'context.valueStack', 'numResults': 0},
		{'code': 'context.valueStack.length', 'numResults': 0},
		{'code': 'context.valueStack.pop()', 'numResults': 0},
		{'code': 'context.valueStack.push()', 'numResults': 0},
		{'code': 'context.valueStack.push(3)', 'numResults': 0},
		{'code': 'context.valueStack.push(1, 2, 3)', 'numResults': 0},
		{'code': 'valueStack.push()', 'numResults': 1},
		{'code': 'valueStack.push(3)', 'numResults': 1},
		{'code': 'valueStack.push(1, 2, 3)', 'numResults': 1},
	];
	processTokenCheckTests(cases, isNoContextValueStackReference, logger);
};