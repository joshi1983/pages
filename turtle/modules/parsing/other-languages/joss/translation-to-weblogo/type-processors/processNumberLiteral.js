import { evaluateToken } from
'../../evaluation/evaluateToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { valueToLiteralCode } from
'../../../../../valueToLiteralCode.js';

function isLikelyPartAndLineNumber(token) {
	const parentType = token.parentNode.type;
	return parentType === ParseTreeTokenType.TREE_ROOT ||
		parentType === ParseTreeTokenType.LINE_OF_CODE;
}

export function processNumberLiteral(token, result) {
	if (isLikelyPartAndLineNumber(token))
		return;

	const val = evaluateToken(token);
	if (val === undefined)
		result.append(token.val); // will result in an error in WebLogo but this is the best way to pass the remaining of the translation task to the human user.
	else {
		result.append(valueToLiteralCode(val));
	}
};