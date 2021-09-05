import { flatten } from
'../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { findToken } from
'../../helpers/findToken.js';
import { getCodeUpToToken } from
'../../../modules/parsing/parse-tree-token/getCodeUpToToken.js';
import { parse } from
'../../../modules/parsing/js-parsing/parse.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';

export function testGetCodeUpToToken(logger) {
	const cases = [
	{'code': 'context.valueStack.push(0)', 'checks': [
		{'token': {'val': 'context'}, 'out': ''},
		{'token': {'val': '.', 'hasParentVal': 'context'}, 'out': 'context'},
		{'token': {'val': 'push'}, 'out': 'context.valueStack.'},
		{'token': {'val': '0'}, 'out': 'context.valueStack.push('},
	]}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const parseResult = parse(caseInfo.code);
		const allTokens = flatten(parseResult.root);
		caseInfo.checks.forEach(function(checkInfo, cIndex) {
			const clogger = prefixWrapper(`Check ${cIndex}`, plogger);
			const token = findToken(checkInfo.token, allTokens, clogger);
			const result = getCodeUpToToken(caseInfo.code, token);
			if (result !== checkInfo.out) {
				clogger(`Expected "${checkInfo.out}" but got "${result}"`);
			}
		});
	});
};