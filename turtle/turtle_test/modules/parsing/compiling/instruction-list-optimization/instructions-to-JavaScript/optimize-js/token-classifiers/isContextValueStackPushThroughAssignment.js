import { isContextValueStackElement } from './isContextValueStackElement.js';
import { isContextValueStackLength } from './isContextValueStackLength.js';
import { ParseTreeTokenType } from
'../../../../../js-parsing/ParseTreeTokenType.js';

export function isContextValueStackPushThroughAssignment(token) {
	if (token.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR || token.children.length !== 2)
		return false;
	if (!isContextValueStackElement(token.children[0]))
		return false;
	const indexValToken = token.children[0].children[1].children[1];
	if (indexValToken.type === ParseTreeTokenType.IDENTIFIER) {
		return isContextValueStackLength(indexValToken);
	}
	if (indexValToken.type === ParseTreeTokenType.BINARY_OPERATOR ||
	(indexValToken.val === '-' || indexValToken.val === '+')) {
		const leftChild = indexValToken.children[0];
		if (!isContextValueStackLength(leftChild))
			return false;
		const numToken = indexValToken.children[1];
		if (numToken.type === ParseTreeTokenType.NUMBER_LITERAL)
			return parseInt(numToken.val) === 0;
	}
	return true;
};