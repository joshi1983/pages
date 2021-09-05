import { convertChildren } from './helpers/convertChildren.js';
import { invalidOperandTokenTypes } from './helpers/invalidOperandTokenTypes.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const invalidPreviousTokenTypes = new Set([
	ParseTreeTokenType.NOT
]);

const invalidNextTokenTypes = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.NUMBER_LITERAL
]);

export function convertInToBinaryOperator(token) {
	let result = false;
	if (token.type === ParseTreeTokenType.IN &&
	token.children.length === 1 &&
	token.children[0].val === 'in' &&
	token.children[0].children.length === 0) {
		token.removeChild(token.children[0]);
		token.val = 'in';
		result = true;
	}
	if (token.type === ParseTreeTokenType.IN &&
	token.children.length === 0 &&
	token.parentNode !== null &&
	token.parentNode.type !== ParseTreeTokenType.FOR_LOOP &&
	token.parentNode.children.length >= 3 &&
	token.parentNode.children.indexOf(token) >= 1 &&
	token.parentNode.children.indexOf(token) < token.parentNode.children.length - 1) {
		const parent = token.parentNode;
		const index = parent.children.indexOf(token);
		const previous = parent.children[index - 1];
		const next = parent.children[index + 1];
		if (!invalidOperandTokenTypes.has(previous.type) &&
		!invalidPreviousTokenTypes.has(previous.type) &&
		!invalidOperandTokenTypes.has(next.type) &&
		!invalidNextTokenTypes.has(next.type)) {
			token.appendChild(previous);
			token.appendChild(next);
			token.type = ParseTreeTokenType.BINARY_OPERATOR;
			token.val = 'in';
			result = true;
		}
	}
	if (convertChildren(token, convertInToBinaryOperator))
		result = true;
	return result;
};