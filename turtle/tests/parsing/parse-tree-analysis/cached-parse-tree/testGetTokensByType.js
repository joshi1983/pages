import { getCachedParseTreeFromCode } from
'../../../helpers/getCachedParseTreeFromCode.js';
import { getTokensByType } from
'../../../../modules/parsing/parse-tree-analysis/cached-parse-tree/getTokensByType.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';

export function testGetTokensByType(logger) {
	const cases = [
	{'code': 'fd 100', 'checks': [
		{'length': 1, 'type': ParseTreeTokenType.PARAMETERIZED_GROUP},
		{'length': 1, 'type': ParseTreeTokenType.NUMBER_LITERAL}
	]},
	{'code': 'print 1 + 4', 'checks': [
		{'length': 2, 'type': ParseTreeTokenType.NUMBER_LITERAL},
		{'length': 1, 'type': ParseTreeTokenType.BINARY_OPERATOR},
	]}];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		caseInfo.checks.forEach(function(checkInfo, checkIndex) {
			const result = getTokensByType(cachedParseTree, checkInfo.type);
			if (result.length !== checkInfo.length)
				plogger(`Check ${checkIndex}: Expected length of ${checkInfo.length} but got ${result.length}`);
		});
	});
};