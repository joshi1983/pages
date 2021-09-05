import { isContextMakeCall } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isContextMakeCall.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsContextMakeCall(logger) {
	const cases = [
		{'code': '', 'numResults': 0},
		{'code': 'f()', 'numResults': 0},
		{'code': 'make()', 'numResults': 0},
		{'code': 'make("x")', 'numResults': 0},
		{'code': 'make("x", 4)', 'numResults': 0},
		{'code': 'c.make("x", 4)', 'numResults': 0},
		{'code': `context(x)`, 'numResults': 0},
		{'code': `localmake(x)`, 'numResults': 0},
		{'code': `context.localmake(x)`, 'numResults': 0},
		{'code': `localmake("x", 4)`, 'numResults': 0},
		{'code': `context.localmake("x", 4)`, 'numResults': 0},
		{'code': `context.make("x", 4)`, 'numResults': 1},
		{'code': `context.make("x")`, 'numResults': 1},
		{'code': `context.make()`, 'numResults': 1},
	];
	processTokenCheckTests(cases, isContextMakeCall, logger);
};