import { isContextGlobalVariableRead } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isContextGlobalVariableRead.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsContextGlobalVariableRead(logger) {
	const cases = [
	{'code': '', 'numResults': 0},
	{'code': 'context.globalVariables.get("x")', 'numResults': 1}
	];
	processTokenCheckTests(cases, isContextGlobalVariableRead, logger);
};