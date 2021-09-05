import { isGlobalVariablesSetCall } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isGlobalVariablesSetCall.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsGlobalVariablesSetCall(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'const x = context.localVariables("x")', 'numResults': 0},
	{'code': 'context.globalVariables.set("x", 2)', 'numResults': 1},
	{'code': 'const x = localVariables("x")', 'numResults': 0},
	{'code': 'const x = localVariables.("x")', 'numResults': 0},
	{'code': 'const x = localVariables.f("x")', 'numResults': 0},
	{'code': 'const x = localVariables.set("x", 3)', 'numResults': 0},
	{'code': 'const x = globalVariables.get("x")', 'numResults': 0},
	{'code': 'context.globalVariables.set("x", 2);', 'numResults': 1},
	{'code': 'globalVariables.get("x")', 'numResults': 0},
	{'code': 'globalVariables.set("x", 2)', 'numResults': 1},
	{'code': 'globalVariables.set("x", 2);\nglobalVariables.set("y", 5);', 'numResults': 2},
	{'code': 'context.globalVariables.set("x", 2);\nglobalVariables.set("y", 5);', 'numResults': 2},
	{'code': 'const x = localVariables.get("x")', 'numResults': 0},
	{'code': 'let x = localVariables.get("x")', 'numResults': 0},
	{'code': 'var x = localVariables.get("x")', 'numResults': 0},
	{'code': 'const y = localVariables.get("y")', 'numResults': 0},
	{'code': 'const x = localVariables.get("x");const y = localVariables.get("y");', 'numResults': 0}
	];
	processTokenCheckTests(cases, isGlobalVariablesSetCall, logger);
};