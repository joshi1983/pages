import { isVariableReadToken } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isVariableReadToken.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsVariableReadToken(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': `context.readVariable("x")`, 'numResults': 1},
	{'code': 'localVariables.get("x")', 'numResults': 1},
	{'code': 'globalVariables.get("x")', 'numResults': 1},
	{'code': 'context.globalVariables.get("x")', 'numResults': 1},
	];
	processTokenCheckTests(cases, isVariableReadToken, logger);
};
