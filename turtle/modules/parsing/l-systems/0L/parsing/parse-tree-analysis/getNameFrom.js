import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const firstChildParentTypes = new Set([
	ParseTreeTokenType.ARROW,
	ParseTreeTokenType.ASSIGNMENT
]);

export function getNameFrom(token) {
	if (firstChildParentTypes.has(token.type))
		return getNameFrom(token.children[0]);
	if (token.type === ParseTreeTokenType.IDENTIFIER)
		return token.val;
	let result = '';
	for (const child of token.children) {
		result += getNameFrom(child);
		result += ' ';
	}
	return result.trim();
};