import { getDescendentsOfType } from
'../../../../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { parse } from
'../../../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

function wrappedForTokenFunc(func, logger) {
	return function(code) {
		const parseResult = parse(code);
		const forTokens = getDescendentsOfType(parseResult.root, ParseTreeTokenType.FOR);
		if (forTokens.length !== 1)
			logger(`Expected 1 FOR token but found ${forTokens.length} in code ${code}`);
		else {
			return func(forTokens[0]);
		}
	};
}

export function processTokenFunctionCases(cases, func, logger) {
	testInOutPairs(cases, wrappedForTokenFunc(func, logger), logger);
};