import { isGlobalVariablesGetCall } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isGlobalVariablesGetCall.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsGlobalVariablesGetCall(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'const x = context.global("x")', 'numResults': 0},
	{'code': 'const x = globalVariables("x")', 'numResults': 0},
	{'code': 'const x = globalVariables.("x")', 'numResults': 0},
	{'code': 'const x = globalVariables.f("x")', 'numResults': 0},
	{'code': 'const x = localVariables.get("x")', 'numResults': 0},
	{'code': 'const x = globalVariables.get("x")', 'numResults': 1},
	{'code': 'const y = globalVariables.get("y")', 'numResults': 1},
	{'code': 'const x = globalVariables.get("x");const y = globalVariables.get("y");', 'numResults': 2}
	];
	processTokenCheckTests(cases, isGlobalVariablesGetCall, logger);
};