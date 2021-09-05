import { isContextValueStackPushThroughAssignment } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isContextValueStackPushThroughAssignment.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsContextValueStackPushThroughAssignment(logger) {
	const cases = [
		{'code': '', 'numResults': 0},
		{'code': 'valueStack.pop()', 'numResults': 0},
		{'code': 'valueStack.length--', 'numResults': 0},
		{'code': 'context.pop()', 'numResults': 0},
		{'code': 'context.valueStack.pop()', 'numResults': 0},
		{'code': 'context.valueStack.push()', 'numResults': 0},// too few parameters
		{'code': 'context.valueStack.push(3)', 'numResults': 0},
		{'code': 'context.valueStack.push(1, 2, 3)', 'numResults': 0},
		{'code': 'valueStack.push()', 'numResults': 0}, 
		{'code': 'valueStack.push(3)', 'numResults': 0},
		{'code': 'valueStack.push(1, 2, 3)', 'numResults': 0},
		{'code': 'context.valueStack[context.valueStack.length - 1] = 1', 'numResults': 0},
		{'code': 'context.valueStack[context.valueStack.length - 0] = context.repcount();', 'numResults': 1},
		{'code': 'context.valueStack[context.valueStack.length - 0] = 1', 'numResults': 1},
		{'code': 'context.valueStack[context.valueStack.length] = 1', 'numResults': 1},
		{'code': 'context.valueStack[context.valueStack.lengt] = 1', 'numResults': 0},
		{'code': 'context.valueStack[context.valueStack.lengt - 0] = 1', 'numResults': 0},
		{'code': 'context.valueStack[x] = 1', 'numResults': 0},
	];
	processTokenCheckTests(cases, isContextValueStackPushThroughAssignment, logger);
};