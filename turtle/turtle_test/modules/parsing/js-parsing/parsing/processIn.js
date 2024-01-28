import { addToken } from './addToken.js';
import { getClosestOfType } from '../../generic-parsing-utilities/getClosestOfType.js';
import { getTopCompleteExpressionToken } from './getTopCompleteExpressionToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const binaryOperatorPreviousTypes = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.REGULAR_EXPRESSION_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TEMPLATE_LITERAL,
]);

function getGoodParentToken(token) {
	const forSettingsToken = getClosestOfType(token, ParseTreeTokenType.FOR_LOOP_SETTINGS);
	if (forSettingsToken !== null)
		return forSettingsToken;
	return token;
}

function shouldBeTreatedLikeBinaryOperator(previous) {
	return binaryOperatorPreviousTypes.has(previous.type);
}

/*
for...in loops are documented at:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in

in can also be a binary operator.  That is documented here:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in
*/
export function processIn(previousToken, nextToken) {
	previousToken = getGoodParentToken(previousToken);
	if (previousToken.type === ParseTreeTokenType.FOR_LOOP_SETTINGS)
		previousToken.appendChild(nextToken);
	else if (shouldBeTreatedLikeBinaryOperator(previousToken)) {
		const newChild = getTopCompleteExpressionToken(previousToken);
		const newParent = newChild.parentNode;
		newChild.remove();
		nextToken.appendChild(newChild);
		newParent.appendChild(nextToken);
	}
	else {
		// should nextToken be treated like a binary operator?
		
		
		addToken(previousToken, nextToken);
	}
};