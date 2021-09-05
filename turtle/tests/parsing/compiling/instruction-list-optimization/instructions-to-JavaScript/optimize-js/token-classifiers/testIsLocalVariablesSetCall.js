import { isLocalVariablesSetCall } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isLocalVariablesSetCall.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsLocalVariablesSetCall(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'const x = context.localVariables("x")', 'numResults': 0},
	{'code': 'const x = localVariables("x")', 'numResults': 0},
	{'code': 'const x = localVariables.("x")', 'numResults': 0},
	{'code': 'const x = localVariables.f("x")', 'numResults': 0},
	{'code': 'localVariables.set("x", 3)', 'numResults': 1},
	{'code': 'const x = globalVariables.get("x")', 'numResults': 0},
	{'code': 'const x = localVariables.get("x")', 'numResults': 0},
	{'code': 'let x = localVariables.get("x")', 'numResults': 0},
	{'code': 'var x = localVariables.get("x")', 'numResults': 0},
	{'code': 'const y = localVariables.get("y")', 'numResults': 0},
	{'code': 'const x = localVariables.get("x");const y = localVariables.get("y");', 'numResults': 0}
	];
	processTokenCheckTests(cases, isLocalVariablesSetCall, logger);
};
