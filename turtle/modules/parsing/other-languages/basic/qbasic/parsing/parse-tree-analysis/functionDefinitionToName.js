import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

/*
The token could be of type:
ParseTreeTokenType.DEF,
ParseTreeTokenType.FUNCTION,
ParseTreeTokenType.SUB
*/
export function functionDefinitionToName(token) {
	let firstChild = token.children[0];
	while (firstChild !== undefined && firstChild.type !== ParseTreeTokenType.IDENTIFIER)
		firstChild = firstChild.children[0];

	if (firstChild !== undefined)
		return firstChild.val.toLowerCase();
};