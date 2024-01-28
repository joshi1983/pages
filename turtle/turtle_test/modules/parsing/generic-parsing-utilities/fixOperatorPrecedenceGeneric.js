import { leftRotate, rightRotate } from './rotate.js';

/*
unfilteredTokens - should be an Array of ParseTreeToken that contains all the binary operator tokens.
binaryOperatorType - should be an integer indicating the binary operator parse tree token type.
	Since the tokens passed in could be for parsing JavaScript or WebLogo code, the 
	binary operator type could be a different number.
compareOperatorPrecedence - is a function that compares precedence of operators specified by symbol string.
	The returned value should be a number that is less than 0 for less than, 0 for equal...
*/
export function fixOperatorPrecedenceGeneric(unfilteredTokens, binaryOperatorType, compareOperatorPrecedence) {
	const binaryOperatorTokens = unfilteredTokens.filter(function(token) {
		return token.type === binaryOperatorType &&
			token.children.length === 2 &&
			(token.children[0].type === binaryOperatorType ||
			token.children[1].type === binaryOperatorType);
	});
	var continueLoop = true;
	while (continueLoop) {
		continueLoop = false;
		binaryOperatorTokens.forEach(function(token) {
			if (token.children[0].type === binaryOperatorType &&
				compareOperatorPrecedence(token.children[0].val, token.val) < 0 &&
				token.children[0].children.length === 2) {
					leftRotate(token);
					continueLoop = true;
			}
			if (token.children[1].type === binaryOperatorType &&
				compareOperatorPrecedence(token.children[1].val, token.val) < 0 &&
				token.children[1].children.length === 2) {
					rightRotate(token);
					continueLoop = true;
			}
		});
	}
};