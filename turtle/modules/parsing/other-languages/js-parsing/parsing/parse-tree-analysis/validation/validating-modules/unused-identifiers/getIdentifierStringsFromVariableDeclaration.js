import { ParseTreeTokenType } from '../../../../../ParseTreeTokenType.js';

function getIdentifierStringFromToken(token) {
	if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	token.children.length !== 0)
		token = token.children[0];
	if (token.type === ParseTreeTokenType.IDENTIFIER)
		return token.val;
}

export function getIdentifierStringsFromVariableDeclaration(token) {
	const result = [];
	for (const child of token.children) {
		const val = getIdentifierStringFromToken(child);
		if (val !== undefined)
			result.push(val);
	}
	return result;
};