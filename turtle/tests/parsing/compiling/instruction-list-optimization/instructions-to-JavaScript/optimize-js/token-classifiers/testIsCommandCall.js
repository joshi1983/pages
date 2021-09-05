import { isCommandCall } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isCommandCall.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsCommandCall(logger) {
	const cases = [
		{'code': '', 'numResults': 0},
		{'code': 'valueStack.pop()', 'numResults': 0},
		{'code': 'context.turtle.forward', 'numResults': 0},
		{'code': 'context.turtle.jumpForward', 'numResults': 0},
		{'code': 'context.forward(100)', 'numResults': 0}, // forward is not in the "compiled" command group.
		{'code': 'context.compiled.localmake("x", 100)', 'numResults': 0},// this is not how "compiled" commands are called.
		{'code': 'context.turtle.forward(100)', 'numResults': 1},
		{'code': 'context.math.forward(100)', 'numResults': 0}, // math is not the command group for forward.
		{'code': 'context.turtle.nonCommandName12345(100)', 'numResults': 0},
		{'code': 'context.turtle.setPenSize(100)', 'numResults': 1},
		{'code': 'context.turtle.setPenSize', 'numResults': 0},
		{'code': 'context.turtle.penSize', 'numResults': 0},
		{'code': 'context.turtle.penSize()', 'numResults': 1},
		{'code': 'context.localmake("x", 4)', 'numResults': 1},
		{'code': 'context.make("x", 4)', 'numResults': 1},
		{'code': 'context.math.sin(90)', 'numResults': 1},
		{'code': 'context.math.arcSin(0.5)', 'numResults': 1},
		{'code': 'context.list.list(0, 1, 2, 3)', 'numResults': 1},
	];
	processTokenCheckTests(cases, isCommandCall, logger);
};