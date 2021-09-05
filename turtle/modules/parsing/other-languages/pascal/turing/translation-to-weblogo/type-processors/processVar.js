import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from
'./processToken.js';

export function processVar(token, result) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	const lastChild = children[children.length - 1];
	if (lastChild !== undefined &&
	lastChild.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		processToken(lastChild, result);
};