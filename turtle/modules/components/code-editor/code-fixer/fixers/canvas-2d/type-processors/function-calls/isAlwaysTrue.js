import { evaluateLiteralToken } from
'../../../../../../../parsing/js-parsing/evaluators/evaluateLiteralToken.js';
import { getDeepestName } from
'../../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/processFunctionCall.js';
import { ParseTreeTokenType } from
'../../../../../../../parsing/js-parsing/ParseTreeTokenType.js';

export function isAlwaysTrue(token) {
	const val = evaluateLiteralToken(token);
	if (val !== undefined)
		return !!val;
	while (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	token.children.length === 3)
		token = token.children[1];
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		const deepestName = getDeepestName(token);
		if (deepestName === 'getContext')
			return true;
	}
	return false;
};