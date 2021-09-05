import { convertChildren } from './helpers/convertChildren.js';
import { invalidOperandTokenTypes } from './helpers/invalidOperandTokenTypes.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function convertUnaryOperatorStructures(token) {
	let result = false;
	if (token.type === ParseTreeTokenType.UNARY_OPERATOR &&
	token.children.length === 0 &&
	token.parentNode.children.length >= 2 &&
	token.parentNode.children.indexOf(token) < token.parentNode.children.length - 1) {
		const parent = token.parentNode;
		const index = parent.children.indexOf(token);
		const next = parent.children[index + 1];
		if (!invalidOperandTokenTypes.has(next.type)) {
			token.appendChild(next);
			result = true;
		}
	}
	if (convertChildren(token, convertUnaryOperatorStructures))
		result = true;
	return result;

};