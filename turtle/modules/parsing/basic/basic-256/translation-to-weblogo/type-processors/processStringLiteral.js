import { ParseTreeTokenType } from
'../../../qbasic/ParseTreeTokenType.js';
import { processColorName, shouldBeProcessedAsColorName } from
'./processColorName.js';

export function isApplicableTo(token) {
	if (token.type !== ParseTreeTokenType.STRING_LITERAL)
		return false;

	return shouldBeProcessedAsColorName(token);
};

export function processStringLiteral(token, result, options) {
	processColorName(token, result, options);
};