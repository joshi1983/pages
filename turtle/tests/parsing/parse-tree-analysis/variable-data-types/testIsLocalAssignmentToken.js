import { findToken } from '../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { getProcedureFromAnyTokenInProcedure } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getProcedureFromAnyTokenInProcedure.js';
import { isLocalAssignmentToken } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/isLocalAssignmentToken.js';
import { MaybeDecided } from '../../../../modules/MaybeDecided.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { Variable } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/Variable.js';

export function testIsLocalAssignmentToken(logger) {
	const cases = [
		{'code': 'make "x 5', 'checks': [
			{'val': 'make', 'varName': 'x', 'newVar': true, 'result': MaybeDecided.No}
		]},
		{'code': 'for ["x 0 5] []', 'checks': [
			{'val': 'for', 'varName': 'x', 'newVar': true, 'result': MaybeDecided.No}
		]},
		{'code': 'to p\nfor ["x 0 5] []\nend', 'checks': [
			{'val': 'for', 'varName': 'x', 'newVar': true, 'result': MaybeDecided.Yes}
		]},
		{'code': 'to p\nlocalmake "x 5\nend', 'checks': [
			{'val': 'localmake', 'varName': 'x', 'newVar': true, 'result': MaybeDecided.Yes}
		]
		},
		{'code': 'to p :x\nmake "x 5\nend', 'checks': [
			{'val': 'make', 'varName': 'x', 'newVar': false, 'result': MaybeDecided.Yes}
		]},
		{
			'code': 'to p\n make "x 5\n end\n p\n print :x', 'checks': [
				{'val': 'make', 'varName': 'x', 'newVar': true, 'result': MaybeDecided.No}
			]
		}
	];
	cases.forEach(function(caseInfo, index) {
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, logger);
		const plogger = prefixWrapper(`Case ${index}.  Code = ${caseInfo.code}`, logger);
		caseInfo.checks.forEach(function(checkInfo) {
			const token = findToken(checkInfo, cachedParseTree, logger);
			if (token !== undefined) {
				const procedure = getProcedureFromAnyTokenInProcedure(token);
				const variable = checkInfo.newVar ? new Variable(checkInfo.varName) : cachedParseTree.getVariables().getVariableByName(checkInfo.varName);
				const result = isLocalAssignmentToken(token, procedure, variable);
				if (result !== checkInfo.result)
					plogger(`Expected ${MaybeDecided.stringify(checkInfo.result)} but got ${MaybeDecided.stringify(result)}`);
			}
		});
	});
};