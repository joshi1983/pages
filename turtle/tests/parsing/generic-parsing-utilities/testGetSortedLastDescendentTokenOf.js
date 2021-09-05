import { findToken } from
'../../helpers/findToken.js';
import { flatten } from
'../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getSortedLastDescendentTokenOf } from
'../../../modules/parsing/generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { parse } from
'../../../modules/parsing/js-parsing/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';

export function testGetSortedLastDescendentTokenOf(logger) {
	const cases = [
	{'code': 'fd', 'inToken': {'val': 'fd'}, 'outToken': {'val': 'fd'}},
	{'code': 'let x = 123;', 'inToken': {'type': ParseTreeTokenType.LET}, 'outToken': {'val': '123'}},
	{'code': 'let x = f(123);', 'inToken': {'type': ParseTreeTokenType.LET}, 'outToken': {'val': ')'}},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const tokens = flatten(parseResult.root);
		const inToken = findToken(caseInfo.inToken, tokens, plogger);
		const outToken = findToken(caseInfo.outToken, tokens, plogger);
		const result = getSortedLastDescendentTokenOf(inToken);
		if (result !== outToken)
			plogger(`Expected ${outToken} but got ${result}`);
	});
};