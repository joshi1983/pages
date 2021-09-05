import { getDataTypeToken } from './getDataTypeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isAlreadyInDeclaration(token) {
	const parent = token.parentNode;
	if (parent === null || parent.type === ParseTreeTokenType.DECLARATION)
		return true;
	return false;
}

export function shouldBecomeDeclaration(token) {
	const dataTypeToken = getDataTypeToken(token);
	if (dataTypeToken === undefined)
		return false;
	if (isAlreadyInDeclaration(token))
		return false;
	if (token.type !== ParseTreeTokenType.IDENTIFIER &&
	token.parentNode.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	return true;
};