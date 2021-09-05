import { isLastNoContextValueStackElementExpression } from './isLastNoContextValueStackElementExpression.js';
import { isValueStackLastElementArrayIndexToken } from './isValueStackLastElementArrayIndexToken.js';
import { ParseTreeTokenType } from
'../../../../../js-parsing/ParseTreeTokenType.js';

// Checks if the token is the root for an expression like context.valueStack[context.valueStack.length - 1];
export function isLastContextValueStackElementExpression(token) {
	if (token.type !== ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION || token.children.length !== 2)
		return false;
	if (!isValueStackLastElementArrayIndexToken(token.children[1]))
		return false;
	let tok1 = token.children[0];
	if (tok1.type !== ParseTreeTokenType.IDENTIFIER || tok1.val !== 'context' || tok1.children.length !== 1)
		return false;
	tok1 = tok1.children[0];
	if (tok1.type !== ParseTreeTokenType.DOT || tok1.children.length !== 1)
		return false;
	tok1 = tok1.children[0];
	return isLastNoContextValueStackElementExpression(tok1, true);
};