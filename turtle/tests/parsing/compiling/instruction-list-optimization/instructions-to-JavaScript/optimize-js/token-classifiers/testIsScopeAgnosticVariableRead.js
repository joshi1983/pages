import { isScopeAgnosticVariableRead } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isScopeAgnosticVariableRead.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsScopeAgnosticVariableRead(logger) {
	const cases = [
	{'code': '',
	'numResults': 0},
	{'code': `context.readVariable("x")`,
	'numResults': 1}
	];
	processTokenCheckTests(cases, isScopeAgnosticVariableRead, logger);
};
