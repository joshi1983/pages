import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function do_(token, result) {
	if (token.children.length !== 2)
		return false;

	const children = token.children[1].children;
	if (children.length === 0)
		return false;

	let firstChild = children[0];
	if (firstChild.type === ParseTreeTokenType.ARG_LIST &&
	firstChild.children.length !== 0)
		firstChild = firstChild.children[0];

	if (firstChild.type === ParseTreeTokenType.PAGE &&
	firstChild.children.length !== 0)
		firstChild = firstChild.children[0];

	if (firstChild.type !== ParseTreeTokenType.NUMBER_LITERAL)
		return false;

	// Call the corresponding procedure.
	result.append(`\npage${firstChild.val}\n`);
	return true;
};