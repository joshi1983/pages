import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function convertNotInStructures(token) {
	let result = false;
	if (token.type === ParseTreeTokenType.NOT &&
	token.children.length === 1 &&
	token.children[0].type === ParseTreeTokenType.NOT &&
	token.children[0].children.length === 0) {
		token.removeChild(token.children[0]);
		result = true;
	}
	if (token.type === ParseTreeTokenType.NOT &&
	token.children.length === 0 &&
	token.parentNode.children.indexOf(token) < token.parentNode.children.length - 1 &&
	token.parentNode.children.length >= 2) {
		const parent = token.parentNode;
		const index = parent.children.indexOf(token);
		const next = parent.children[index + 1];
		if (next.type === ParseTreeTokenType.IN &&
		next.children.length === 0) {
			token.type = ParseTreeTokenType.BINARY_OPERATOR;
			parent.removeChild(next);
			token.val = 'not in';
			result = true;
		}
	}
	if (convertChildren(token, convertNotInStructures))
		result = true;
	return result;
};