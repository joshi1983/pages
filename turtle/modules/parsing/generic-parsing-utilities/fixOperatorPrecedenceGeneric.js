import { leftRotate, rightRotate } from './rotate.js';

/*
unfilteredTokens - should be an Array of ParseTreeToken that contains all the binary operator tokens.
binaryOperatorType - should be an integer indicating the binary operator parse tree token type.
	Since the tokens passed in could be for parsing JavaScript or WebLogo code, the 
	binary operator type could be a different number.
compareOperatorPrecedence - is a function that compares precedence of operators specified by symbol string.
	The returned value should be a number that is less than 0 for less than, 0 for equal...
*/
export function fixOperatorPrecedenceGeneric(unfilteredTokens, binaryOperatorTypes, compareOperatorPrecedence) {
	if (typeof binaryOperatorTypes === 'number')
		binaryOperatorTypes = new Set([binaryOperatorTypes]);
	else if (binaryOperatorTypes instanceof Array)
		binaryOperatorTypes = new Set(binaryOperatorTypes);
	else if (!(binaryOperatorTypes instanceof Set))
		throw new Error(`binaryOperatorTypes must be a number, Array, or Set but got ${binaryOperatorTypes}`);
	const binaryOperatorTokens = unfilteredTokens.filter(function(token) {
		return binaryOperatorTypes.has(token.type) &&
			token.children.length === 2 &&
			(binaryOperatorTypes.has(token.children[0].type) ||
			binaryOperatorTypes.has(token.children[1].type));
	});
	let continueLoop = true;
	while (continueLoop) {
		continueLoop = false;
		binaryOperatorTokens.forEach(function(token) {
			if (binaryOperatorTypes.has(token.children[0].type) &&
				compareOperatorPrecedence(token.children[0].val, token.val, token.children[0], token) < 0 &&
				token.children[0].children.length === 2) {
					leftRotate(token);
					continueLoop = true;
			}
			if (binaryOperatorTypes.has(token.children[1].type) &&
				compareOperatorPrecedence(token.children[1].val, token.val, token.children[1], token) < 0 &&
				token.children[1].children.length === 2) {
					rightRotate(token);
					continueLoop = true;
			}
		});
	}
};