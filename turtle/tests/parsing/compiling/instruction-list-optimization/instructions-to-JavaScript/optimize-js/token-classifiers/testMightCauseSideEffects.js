import { mightCauseSideEffects } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/mightCauseSideEffects.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testMightCauseSideEffects(logger) {
	const cases = [
		{'code': '', 'numResults': 0},
		{'code': 'valueStack.pop()', 'numResults': 0},
		{'code': 'context.turtle.forward', 'numResults': 0},
		{'code': 'context.turtle.jumpForward', 'numResults': 0},
		{'code': 'context.turtle.forward(100)', 'numResults': 1},
		{'code': 'context.turtle.setPenSize(100)', 'numResults': 1},
		{'code': 'context.turtle.setPenSize', 'numResults': 0},
		{'code': 'context.turtle.penSize', 'numResults': 0},
		{'code': 'context.turtle.penSize()', 'numResults': 0},
	];
	processTokenCheckTests(cases, mightCauseSideEffects, logger);
};