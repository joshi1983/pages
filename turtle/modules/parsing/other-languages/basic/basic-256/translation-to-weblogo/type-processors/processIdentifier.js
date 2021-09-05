import { Basic256Procedures } from
'../../Basic256Procedures.js';
import { ParseTreeTokenType } from
'../../../qbasic/ParseTreeTokenType.js';
import { processColorName, shouldBeProcessedAsColorName } from
'./processColorName.js';

export function isApplicableTo(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	if (shouldBeProcessedAsColorName(token))
		return true;

	return Basic256Procedures.has(token.val);
};

export function processIdentifier(token, result, options) {
	if (shouldBeProcessedAsColorName(token)) {
		processColorName(token, result, options);
		return;
	}
	result.append(` ${token.val} `);
};