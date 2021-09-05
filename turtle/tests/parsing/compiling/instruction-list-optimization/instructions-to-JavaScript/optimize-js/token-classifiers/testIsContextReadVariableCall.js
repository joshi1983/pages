import { isContextReadVariableCall } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isContextReadVariableCall.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsContextReadVariableCall(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'const x = context("x")', 'numResults': 0},
	{'code': 'const x = context.("x")', 'numResults': 0},
	{'code': 'const x = context.f("x")', 'numResults': 0},
	{'code': 'const x = context.readVariable("x")', 'numResults': 1},
	{'code': 'const y = context.readVariable("y")', 'numResults': 1},
	{'code': 'const x = context.readVariable("x");const y = context.readVariable("y");', 'numResults': 2}
	];
	processTokenCheckTests(cases, isContextReadVariableCall, logger);
};