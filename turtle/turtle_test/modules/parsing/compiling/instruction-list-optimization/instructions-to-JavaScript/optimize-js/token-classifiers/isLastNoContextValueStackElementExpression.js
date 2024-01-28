import { isValueStackLastElementArrayIndexToken } from './isValueStackLastElementArrayIndexToken.js';
import { isValueStackLength } from './isValueStackLength.js';
import { ParseTreeTokenType } from
'../../../../../js-parsing/ParseTreeTokenType.js';

// Checks if the token is the root for an expression like context.valueStack[context.valueStack.length - 1];
export function isLastNoContextValueStackElementExpression(token, ignoreParent) {
	let tok1 = token;
	if (ignoreParent !== true) {
		const parent = token.parentNode;
		if (parent !== null && parent.type === ParseTreeTokenType.DOT)
			return false;
		if (token.type !== ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION || token.children.length !== 2)
			return false;
		if (!isValueStackLastElementArrayIndexToken(token.children[1]))
			return false;
		tok1 = token.children[0];
	}
	if (tok1.type !== ParseTreeTokenType.IDENTIFIER || tok1.val !== 'valueStack' || tok1.children.length !== 0)
		return false;
	return true;
};