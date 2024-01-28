import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function isBeingRead(token) {
	while (token.parentNode !== null) {
		if (token.parentNode.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
			const childIndex = token.parentNode.children.indexOf(token);
			if (childIndex === 0) // left side of assignment
				return false;
		}
		token = token.parentNode;
	}
	return true;
};