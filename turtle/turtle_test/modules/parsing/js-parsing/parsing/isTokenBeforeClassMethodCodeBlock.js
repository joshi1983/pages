import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function isTokenBeforeClassMethodCodeBlock(token) {
	if (token.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET)
		token = token.parentNode;
	if (token.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	const methodNameToken = token.parentNode;
	if (methodNameToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	let classBodyToken = methodNameToken.parentNode;
	while (classBodyToken.val === 'static' || classBodyToken.val === 'async')
		classBodyToken = classBodyToken.parentNode;
	if (classBodyToken.type !== ParseTreeTokenType.CLASS_BODY)
		return false;
	return true;
};