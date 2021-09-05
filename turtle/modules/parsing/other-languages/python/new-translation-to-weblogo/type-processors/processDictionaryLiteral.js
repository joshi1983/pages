import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isBeingAssigned(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	parent.val === '=' &&
	parent.children.indexOf(token) === 1)
		return true;
	return false;
}

function processChildrenUsingSetProperty(token, result) {
	result.append('\n');
	
}

export function processDictionaryLiteral(token, result) {
	result.trimRight();
	result.append(' createPList\n');
	if (token.children.length !== 0) {
		if (isBeingAssigned(token))
			processChildrenUsingSetProperty(token, result);
	}
};