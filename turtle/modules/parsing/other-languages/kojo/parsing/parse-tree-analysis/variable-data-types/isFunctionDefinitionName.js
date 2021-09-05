import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function isFunctionDefinitionName(token) {
	let parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	parent.children[0] === token)
		parent = parent.parentNode;
	if (parent.type !== ParseTreeTokenType.DEF)
		return false;
	return true;
};