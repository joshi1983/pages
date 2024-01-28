import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

export function stringLiteralToAssignmentCommandToken(token) {
	if (token.type !== ParseTreeTokenType.STRING_LITERAL)
		return null;
	let p = token.parentNode;
	if (p === null || p.type !== ParseTreeTokenType.ARG_LIST || p.children.length !== 5)
		return null;
	p = p.parentNode;
	if (p === null || p.type !== ParseTreeTokenType.FUNCTION_CALL)
		return null;
	p = p.children[0];
	if (p === null || p.type !== ParseTreeTokenType.IDENTIFIER || p.val !== 'context')
		return null;
	p = p.children[0];
	if (p === null || p.type !== ParseTreeTokenType.DOT)
		return null;
	p = p.children[0];
	if (p === null || p.type !== ParseTreeTokenType.IDENTIFIER)
		return null;
	return p;
};