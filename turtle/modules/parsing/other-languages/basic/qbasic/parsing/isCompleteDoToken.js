import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const parentTypesIndicating0Children = new Set([
	ParseTreeTokenType.DO_UNTIL,
	ParseTreeTokenType.DO_WHILE,
	ParseTreeTokenType.EXIT
]);

export function isCompleteDoToken(doToken) {
	const children = doToken.children;
	if (children.length >= 2)
		return true;
	const parent = doToken.parentNode;
	if (parentTypesIndicating0Children.has(parent.type))
		return true;
	
	return false;
};