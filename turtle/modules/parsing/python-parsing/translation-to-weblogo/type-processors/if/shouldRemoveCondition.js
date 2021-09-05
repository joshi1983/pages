import { hasElseOrElif } from './hasElseOrElif.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function isNameMainCondition(token) {
	if (token.type !== ParseTreeTokenType.BINARY_OPERATOR ||
	token.val !== '==' ||
	token.children.length !== 2)
		return false;
	let nameFound = false, mainFound = false;
	for (let child of token.children) {
		if (child.type === ParseTreeTokenType.IDENTIFIER &&
		child.val === '_name_')
			nameFound = true;
		if (child.type === ParseTreeTokenType.STRING_LITERAL &&
		child.val === '__main__')
			mainFound = true;
	}
	return nameFound && mainFound;
}

export function shouldRemoveCondition(token) {
	if (hasElseOrElif(token))
		return false;
	const condition = token.children[0];
	if (isNameMainCondition(condition))
		return true;
	return false;
};