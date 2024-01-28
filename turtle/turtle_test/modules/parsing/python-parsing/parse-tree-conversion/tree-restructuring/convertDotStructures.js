import { convertChildren } from './helpers/convertChildren.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function convertDotStructures(token) {
	let result = false;
	if (token.type === ParseTreeTokenType.DOT &&
	token.children.length === 0 &&
	token.parentNode !== null &&
	token.parentNode.children.indexOf(token) === 0 &&
	token.parentNode.children.length === 2) {
		const parent = token.parentNode;
		const grandParent = parent.parentNode;
		token.appendChild(parent.children[1]);
		if (grandParent !== null &&
		(grandParent.type === ParseTreeTokenType.UNRECOGNIZED) &&
		grandParent.children.indexOf(parent) === 1 &&
		grandParent.children[0].type === ParseTreeTokenType.IDENTIFIER &&
		grandParent.children[0].children.length === 0) {
			grandParent.children[0].appendChild(token);
		}

		convertDotStructures(token.children[0]);
		result = true;
	}
	else {
		if (convertChildren(token, convertDotStructures))
			result = true;
	}
	return result;
};