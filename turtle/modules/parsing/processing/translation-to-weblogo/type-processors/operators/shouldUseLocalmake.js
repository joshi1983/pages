import { getClosestOfType } from '../../../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

function isDeclaringVariable(token) {
	const closestDeclaration = getClosestOfType(token, ParseTreeTokenType.DECLARATION);
	return closestDeclaration !== null;
}

export function shouldUseLocalmake(token) {
	const methodToken = getClosestOfType(token, ParseTreeTokenType.METHOD);
	if (methodToken === null)
		return false;
	if (isDeclaringVariable(token))
		return true;
	if (methodToken.children.length > 2) {
		const paramsParent = methodToken.children[2];
		if (paramsParent.type === ParseTreeTokenType.ARG_LIST) {
			const children = paramsParent.children;
			const varNameToken = token.children[0];
			if (varNameToken !== undefined &&
			children.some(c => c.type === ParseTreeTokenType.IDENTIFIER &&
				c.val === varNameToken.val))
				return true;
		}
	}
	return false;
};