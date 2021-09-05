import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function convertArgumentStarStructures(token) {
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR &&
	(token.val === '*' || token.val === '**') &&
	token.children.length === 0 &&
	token.parentNode !== null &&
	token.parentNode.children[0].val === '(' &&
	token.parentNode.children.length > 1 &&
	token.parentNode.children.indexOf(token) > 0) {
		const parent = token.parentNode;
		const index = parent.children.indexOf(token);
		if (index + 1 < parent.children.length &&
		parent.children[index + 1].type === ParseTreeTokenType.IDENTIFIER) {
			const next = parent.children[index + 1];
			token.appendChild(next);
			token.type = ParseTreeTokenType.ARGUMENT_STAR;
			return true;
		}
	}
	else {
		let result = false;
		if (convertChildren(token, convertArgumentStarStructures))
			result = true;

		return result;
	}
};