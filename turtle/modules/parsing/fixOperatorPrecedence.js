import { ParseTreeToken } from './ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { Operators } from './Operators.js';

function rotate(parentToken, direction) {
	const grandParent = parentToken.parentNode;
	const child = parentToken.children[direction];
	const grandChild = child.children[1 - direction];
	child.removeChild(grandChild);
	parentToken.replaceChild(child, grandChild);
	if (grandParent !== null)
		grandParent.replaceChild(parentToken, child);
	else
		child.parentNode = null;
	child.appendChild(parentToken);
}

function leftRotate(parentToken) {
	rotate(parentToken, 0);
}

function rightRotate(parentToken) {
	rotate(parentToken, 1);
}

/*
Note that this assumes your module already waited for Operators.asyncInit().
*/
export function fixOperatorPrecedence(parseTreeToken) {
	if (parseTreeToken instanceof Array)
		throw new Error('parseTreeToken must not be an Array');
	const binaryOperatorTokens = ParseTreeToken.flatten(parseTreeToken).filter(function(token) {
		return token.type === ParseTreeTokenType.BINARY_OPERATOR &&
			token.children.length === 2 &&
			(token.children[0].type === ParseTreeTokenType.BINARY_OPERATOR ||
			token.children[1].type === ParseTreeTokenType.BINARY_OPERATOR);
	});
	var continueLoop = true;
	while (continueLoop) {
		continueLoop = false;
		binaryOperatorTokens.forEach(function(token) {
			if (token.children[0].type === ParseTreeTokenType.BINARY_OPERATOR &&
				Operators.compareOperatorPrecedence(token.children[0].val, token.val) < 0 &&
				token.children[0].children.length === 2) {
					leftRotate(token);
					continueLoop = true;
			}
			if (token.children[1].type === ParseTreeTokenType.BINARY_OPERATOR &&
				Operators.compareOperatorPrecedence(token.children[1].val, token.val) < 0 &&
				token.children[1].children.length === 2) {
					rightRotate(token);
					continueLoop = true;
			}
		});
	}
}