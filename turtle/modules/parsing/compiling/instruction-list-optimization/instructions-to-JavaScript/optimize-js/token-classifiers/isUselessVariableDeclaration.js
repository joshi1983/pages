import { declaringTypes } from '../../../../../js-parsing/parsing/declaringTypes.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';

/*
Looks for tokens in declarations like:
let x = x;
const x = x;
*/
export function isUselessVariableDeclaration(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER ||
	token.children.length !== 0)
		return false;
	const parent = token.parentNode;
	if (parent.children.indexOf(token) !== 0 ||
	parent.children.length !== 2 ||
	parent.val !== '=')
		return false;
	const declareToken = parent.parentNode;
	if (!declaringTypes.has(declareToken.type) ||
	declareToken.children.length !== 1)
		return false;
	const rightSideToken = parent.children[1];
	if (rightSideToken.type !== ParseTreeTokenType.IDENTIFIER ||
	rightSideToken.children.length !== 0 ||
	rightSideToken.val !== token.val)
		return false;
	return true;
};