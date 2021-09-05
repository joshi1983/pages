import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

// Checks that token is in a path similar to
// .get("x")
export function isVariableReadBasic(token) {
	if (token.type !== ParseTreeTokenType.STRING_LITERAL)
		return false;
	const argListToken = token.parentNode;
	if (argListToken.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	if (argListToken.children.length !== 3)
		return false;
	let p = argListToken.parentNode;
	if (p.type !== ParseTreeTokenType.FUNCTION_CALL || p.children.length !== 2)
		return false;
	p = p.children[0];
	if (p.type === ParseTreeTokenType.EXPRESSION_DOT) {
		p = p.children[1];
		if (p.val !== '.')
			return false;
	}
	else if (p.type === ParseTreeTokenType.IDENTIFIER && p.children.length !== 0) {
		p = p.children[0];
	}
	while (p.children.length === 1)
		p = p.children[0];

	if (p.val !== 'get' || p.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	return true;
};