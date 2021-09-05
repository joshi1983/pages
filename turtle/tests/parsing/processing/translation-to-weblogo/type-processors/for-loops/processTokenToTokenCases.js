import { findToken } from
'../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../../../modules/parsing/processing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/processing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function processTokenToTokenCases(cases, f, logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const tokens = flatten(parseResult.root);
		const forToken = findToken({'type': ParseTreeTokenType.FOR}, tokens, plogger);
		if (forToken === undefined)
			return;

		const result = f(forToken);
		if (caseInfo.outToken === null) {
			if (result !== null)
				plogger(`Expected null but found a token.  result=${result}`);
		}
		else {
			const expectedToken = findToken(caseInfo.outToken, tokens, plogger);
			if (expectedToken !== result)
				if (result === null)
					plogger(`Expected one token but found another. result is null.`);
				else
					plogger(`Expected one token but found another.  result.val=${result.val}, result.type=${ParseTreeTokenType.getNameFor(result.type)}`);
			}
	});
};