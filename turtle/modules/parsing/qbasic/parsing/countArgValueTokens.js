import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const nonValueTypes = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
]);

export function countArgValueTokens(argListToken) {
	let result = 0;
	for (const child of argListToken.children) {
		if (!nonValueTypes.has(child.type)) {
			result ++;
		}
	}
	return result;
};