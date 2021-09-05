import { isContextLocalVariablesGet } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isContextLocalVariablesGet.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsContextLocalVariablesGet(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'const x = context.localVariables("x")', 'numResults': 0},
	{'code': 'const x = context.localVariables.get("x")', 'numResults': 0}, // localVariables is not a property of context.
	{'code': 'context.getCurrentExecutingProcedure().localVariables.get("colorindex")', 'numResults': 1},
	];
	processTokenCheckTests(cases, isContextLocalVariablesGet, logger);
};