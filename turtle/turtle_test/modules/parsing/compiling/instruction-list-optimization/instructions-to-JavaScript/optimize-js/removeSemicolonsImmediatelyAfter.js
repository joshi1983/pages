import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';

export function removeSemicolonsImmediatelyAfter(token) {
	const parent = token.parentNode;
	const children = parent.children;
	let index = children.indexOf(token);
	for (index++; index < children.length; index++) {
		const child = children[index];
		if (child.type === ParseTreeTokenType.SEMICOLON) {
			child.remove();
			index--;
		}
		else
			break;
	}
};