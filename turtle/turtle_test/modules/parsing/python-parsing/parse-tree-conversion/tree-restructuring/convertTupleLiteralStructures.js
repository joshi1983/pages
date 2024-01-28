import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function convertTupleLiteralStructures(token) {
	let result = false;
	if (token.type === ParseTreeTokenType.TUPLE_LITERAL &&
	token.parentNode !== null) {
		if (token.children.length === 3 &&
		token.children[0].val === '(' &&
		token.children[1].val === null &&
		token.children[1].type === ParseTreeTokenType.UNRECOGNIZED &&
		token.children[2].val === ')') {
			const middleChild = token.children[1];
			token.removeChild(middleChild);
			while (middleChild.children.length !== 0)
				token.insertChildBefore(token.children.length - 1, middleChild.children[0]);
			result = true;
		}
	}
	if (convertChildren(token, convertTupleLiteralStructures))
		result = true;
	return result;
};