import { ParseTreeTokenType } from '../../../modules/parsing/python-parsing/ParseTreeTokenType.js';

/*
Useful for troubleshooting failing tests if you run:
console.log(jsonifyParseTree(token, code));
*/
export function jsonifyParseTree(token, code) {
	const result = {
		'val': token.val,
		'originalString': token.originalString,
		'type': ParseTreeTokenType.getNameFor(token.type),
		'children': token.children.map(child => jsonifyParseTree(child, code))
	};
	return result;
};