import { declaringTypes } from '../../../../declaringTypes.js';
import { ParseTreeTokenType } from '../../../../../ParseTreeTokenType.js';

export function isIdentifierFromVariableDeclaration(token) {
	const parentToken = token.parentNode;
	let declareChild = token;
	if (parentToken.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
		if (parentToken.children.indexOf(token) !== 0)
			return false;
		declareChild = parentToken;
	}
	const parentOfDeclareChild = declareChild.parentNode;
	return declaringTypes.has(parentOfDeclareChild.type);
};