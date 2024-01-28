import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const nextTokenTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.LIST_LITERAL,
	ParseTreeTokenType.NONE,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.TUPLE_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR
]);

export function convertAssignmentOperatorStructures(token) {
	let result = false;
	if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	token.children.length === 0 &&
	token.parentNode !== null
	) {
		if (token.parentNode.children.length === 1 &&
		token.parentNode.type === ParseTreeTokenType.UNRECOGNIZED &&
		token.parentNode.parentNode !== null) {
			const grandparent = token.parentNode.parentNode;
			// move token up 1 level in the tree.
			grandparent.replaceChild(token.parentNode, token);
			result = true;
		}
		if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
		token.parentNode.parentNode !== null &&
		token.parentNode.children.length === 3 &&
		token.parentNode.children.indexOf(token) === 1) {
			const parent = token.parentNode;
			const leftSide = parent.children[0];
			const rightSide = parent.children[2];
			token.appendChild(leftSide);
			token.appendChild(rightSide);
			parent.parentNode.replaceChild(parent, token);
			result = true;
		}
		else if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
		token.children.length === 0 &&
		token.parentNode.children.length >= 3) {
			const parent = token.parentNode;
			const index = parent.children.indexOf(token);
			const previousToken = parent.children[index - 1];
			const nextToken = parent.children[index + 1];
			if (previousToken.type === ParseTreeTokenType.IDENTIFIER && nextTokenTypes.has(nextToken.type)) {
				token.appendChild(previousToken);
				token.appendChild(nextToken);
				result = true;
			}
		}
	}
	if (convertChildren(token, convertAssignmentOperatorStructures))
		result = true;
	return result;
};