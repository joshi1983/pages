import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processTokens } from
'./helpers/processTokens.js';

const ignoredTypes = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET
]);

export function processTupleLiteral(token, result, options) {
	result.append(' [ ');
	processTokens(token.children.filter(t => !ignoredTypes.has(t.type)), result, options);
	result.append(' ] ');
};