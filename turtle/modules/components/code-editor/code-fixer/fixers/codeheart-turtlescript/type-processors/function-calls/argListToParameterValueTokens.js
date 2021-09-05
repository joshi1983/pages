import { ParseTreeTokenType } from
'../../../../../../../parsing/js-parsing/ParseTreeTokenType.js';

const nonValueTypes = new Set([
ParseTreeTokenType.COMMA,
ParseTreeTokenType.CURVED_LEFT_BRACKET,
ParseTreeTokenType.CURVED_RIGHT_BRACKET
]);

export function argListToParameterValueTokens(argListToken) {
	let children = argListToken instanceof Array ? argListToken : argListToken.children;
	return children.filter(t => !nonValueTypes.has(t.type));
};