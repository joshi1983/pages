import { findToken } from
'../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../../../modules/parsing/processing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/processing/ParseTreeTokenType.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

function wrappedF(f, logger) {
	return function(code) {
		const parseResult = parse(code);
		const tokens = flatten(parseResult.root);
		const forToken = findToken({'type': ParseTreeTokenType.FOR}, tokens, logger);
		if (forToken !== undefined) {
			return f(forToken);
		}
	};
}

export function processForTokenToSimpleValueTest(cases, f, logger) {
	testInOutPairs(cases, wrappedF(f, logger) , logger);
};