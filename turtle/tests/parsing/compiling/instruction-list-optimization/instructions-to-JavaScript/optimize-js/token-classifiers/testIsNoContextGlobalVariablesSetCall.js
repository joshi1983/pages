import { isNoContextGlobalVariablesSetCall } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isNoContextGlobalVariablesSetCall.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsNoContextGlobalVariablesSetCall(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'const x = context.localVariables("x")', 'numResults': 0},
	{'code': 'context.globalVariables.set("x", 2)', 'numResults': 0},
	{'code': 'const x = localVariables("x")', 'numResults': 0},
	{'code': 'globalVariables.get("x")', 'numResults': 0},
	{'code': 'globalVariables.set("x")', 'numResults': 0}, // too few arguments.
	{'code': 'globalVariables.set("x", 2)', 'numResults': 1},
	{'code': 'globalVariables.set("x", "hi")', 'numResults': 1}
	];
	processTokenCheckTests(cases, isNoContextGlobalVariablesSetCall, logger);
};