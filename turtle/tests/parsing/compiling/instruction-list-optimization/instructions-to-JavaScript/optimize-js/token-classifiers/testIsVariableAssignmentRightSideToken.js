import { isVariableAssignmentRightSideToken } from
'../../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/token-classifiers/isVariableAssignmentRightSideToken.js';
import { processTokenCheckTests } from './processTokenCheckTests.js';

export function testIsVariableAssignmentRightSideToken(logger) {
	const cases = [
		{'code': '',
		'numResults': 0},
		{'code': 'context.globalVariables.get("colorindex")',
		'numResults': 1},
		{'code': 'globalVariables.get("colorindex")',
		'numResults': 1},
		{'code': 'context.readVariable("colorindex")',
		'numResults': 1},
		{'code': 'localVariables.get("colorindex")',
		'numResults': 1},
		{'code': 'context.getCurrentExecutingProcedure().localVariables.get("colorindex")',
		'numResults': 1}
	];
	processTokenCheckTests(cases, isVariableAssignmentRightSideToken, logger);
};