import { isContextLocalVariablesSet } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isContextLocalVariablesSet.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsContextLocalVariablesSet(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'const x = context.localVariables("x")', 'numResults': 0},
	{'code': 'const x = context.localVariables("x", 4)', 'numResults': 0},
	{'code': 'const x = context.localVariables.get("x")', 'numResults': 0}, // localVariables is not a property of context.
	{'code': 'const x = context.localVariables.set("x")', 'numResults': 0}, // localVariables is not a property of context.
	{'code': 'context.getCurrentExecutingProcedure().localVariables.get("colorindex")', 'numResults': 0},
	{'code': 'context.getCurrentExecutingProcedure().localVariables.set("colorindex")', 'numResults': 0},
	{'code': 'context.getCurrentExecutingProcedure().localVariables.set("colorindex", 4)', 'numResults': 1},
	];
	processTokenCheckTests(cases, isContextLocalVariablesSet, logger);
};