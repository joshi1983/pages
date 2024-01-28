import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function convertListLiteralStructures(token) {
	let result = false;
	if (token.type === ParseTreeTokenType.LIST_LITERAL &&
	token.parentNode !== null) {
		if (token.parentNode.parentNode !== null &&
		token.parentNode.children.indexOf(token) === 1 &&
		token.parentNode.children.length === 3 &&
		(token.children.length < 2 || token.children[0].val !== '[')) {
			const parent = token.parentNode;
			const openBracket = parent.children[0];
			const closeBracket = parent.children[2];
			token.insertChildBefore(0, openBracket);
			token.appendChild(closeBracket);
			parent.parentNode.replaceChild(parent, token);
			result = true;
		}
		else if (token.children.length === 3 &&
		token.children[0].val === '[' &&
		token.children[1].val === null &&
		token.children[1].type === ParseTreeTokenType.UNRECOGNIZED &&
		token.children[2].val === ']') {
			const middleChild = token.children[1];
			token.removeChild(middleChild);
			while (middleChild.children.length !== 0)
				token.insertChildBefore(token.children.length - 1, middleChild.children[0]);
			result = true;
		}
	}
	if (convertChildren(token, convertListLiteralStructures))
		result = true;
	return result;
};