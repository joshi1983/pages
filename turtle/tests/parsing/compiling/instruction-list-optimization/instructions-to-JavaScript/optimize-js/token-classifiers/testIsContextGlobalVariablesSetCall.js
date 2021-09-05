import { isContextGlobalVariablesSetCall } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isContextGlobalVariablesSetCall.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsContextGlobalVariablesSetCall(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'const x = context.localVariables("x")', 'numResults': 0},
	{'code': 'context.globalVariables.set("x", 2)', 'numResults': 1},
	{'code': 'const x = localVariables("x")', 'numResults': 0},
	{'code': 'const x = localVariables.("x")', 'numResults': 0},
	{'code': 'const x = localVariables.f("x")', 'numResults': 0},
	{'code': 'const x = localVariables.set("x", 3)', 'numResults': 0},
	{'code': 'const x = globalVariables.get("x")', 'numResults': 0},
	{'code': 'globalVariables.get("x")', 'numResults': 0},
	{'code': 'globalVariables.set("x", 2)', 'numResults': 0},
	{'code': 'globalVariables.set("x", 2);\nglobalVariables.set("y", 5);', 'numResults': 0},
	{'code': 'const x = localVariables.get("x")', 'numResults': 0},
	{'code': 'let x = localVariables.get("x")', 'numResults': 0},
	{'code': 'var x = localVariables.get("x")', 'numResults': 0},
	{'code': 'const y = localVariables.get("y")', 'numResults': 0},
	{'code': 'const x = localVariables.get("x");const y = localVariables.get("y");', 'numResults': 0},
	{'code': 'context.globalVariables.set("x", 4)', 'numResults': 1}
	];
	processTokenCheckTests(cases, isContextGlobalVariablesSetCall, logger);
};