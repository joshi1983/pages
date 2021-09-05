import { isContextGlobalVariablesGetCall } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isContextGlobalVariablesGetCall.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsContextGlobalVariablesGetCall(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'const x = context.global("x")', 'numResults': 0},
	{'code': 'const x = globalVariables("x")', 'numResults': 0},
	{'code': 'const x = globalVariables.("x")', 'numResults': 0},
	{'code': 'const x = globalVariables.f("x")', 'numResults': 0},
	{'code': 'const x = localVariables.get("x")', 'numResults': 0},
	{'code': 'const x = globalVariables.get("x")', 'numResults': 0},
	{'code': 'const y = context.globalVariables.get("y")', 'numResults': 1},
	{'code': 'const x = context.globalVariables.get("x");const y = context.globalVariables.get("y");', 'numResults': 2},
	{'code': 'context.turtle.setPenColor(this.convertToAlphaColourOrTransparent(context.globalVariables.get("seatcolor")))', 'numResults': 1},
	];
	processTokenCheckTests(cases, isContextGlobalVariablesGetCall, logger);
};