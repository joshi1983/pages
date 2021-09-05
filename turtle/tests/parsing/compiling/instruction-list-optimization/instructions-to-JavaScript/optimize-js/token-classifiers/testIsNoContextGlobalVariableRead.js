import { isNoContextGlobalVariableRead } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isNoContextGlobalVariableRead.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsNoContextGlobalVariableRead(logger) {
	const cases = [
	{'code': '',
	'numResults': 0},
	{'code': `context.readVariable("x")`,
	'numResults': 0},
	{'code': `globalVariables.get("x")`,
	'numResults': 1}
	];
	processTokenCheckTests(cases, isNoContextGlobalVariableRead, logger);
};