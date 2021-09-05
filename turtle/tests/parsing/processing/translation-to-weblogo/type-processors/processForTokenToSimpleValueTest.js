import { findToken } from
'../../../../helpers/findToken.js';
import { flatten } from
'../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../../modules/parsing/processing/parse.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/processing/ParseTreeTokenType.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

function wrappedF(f, tokenInfo, logger) {
	return function(code) {
		const parseResult = parse(code);
		const tokens = flatten(parseResult.root);
		const token = findToken(tokenInfo, tokens, logger);
		if (token !== undefined) {
			return f(token);
		}
	};
}

export function processForTokenToSimpleValueTest(cases, f, logger, tokenInfo) {
	if (tokenInfo === undefined) {
		tokenInfo = {
			'type': ParseTreeTokenType.FOR
		};
	}
	testInOutPairs(cases, wrappedF(f, tokenInfo, logger) , logger);
};