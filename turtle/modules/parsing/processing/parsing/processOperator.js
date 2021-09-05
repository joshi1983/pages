import { addCodeBlockIfNeeded } from './addCodeBlockIfNeeded.js';
import { addDeclaration } from './addDeclaration.js';
import { addToken } from './addToken.js';
import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { getClosestOfType } from '../../generic-parsing-utilities/getClosestOfType.js';
import { getTopCompleteExpressionToken } from './getTopCompleteExpressionToken.js';
import { Operators } from '../Operators.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { shouldBecomeDeclaration } from './shouldBecomeDeclaration.js';

const badPreviousTokenTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.INDEX_EXPRESSION
]);

const previousBinaryOperatorTypes = new Set([
ParseTreeTokenType.BOOLEAN_LITERAL,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.EXPRESSION_DOT,
ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
ParseTreeTokenType.METHOD_CALL,
ParseTreeTokenType.IDENTIFIER,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.STRING_LITERAL,
ParseTreeTokenType.UNARY_OPERATOR
]);

function setCodeBlockParentIfNeeded(previousToken) {
	const parent = previousToken.parentNode;
	if (parent === null ||
	parent.type !== ParseTreeTokenType.CURLY_BRACKET_EXPRESSION)
		return;
	if (parent.children.length > 1) {
		const secondChild = parent.children[1];
		if (secondChild.type === ParseTreeTokenType.COLON)
			return;
	}
	parent.type = ParseTreeTokenType.CODE_BLOCK;
}

function shouldBeTreatedAsBinaryOperator(previousToken, nextToken) {
	const operatorInfo = Operators.getOperatorInfo(nextToken.val);
	if (operatorInfo.isNotBinary === true)
		return false; // definitely not binary.
	if (operatorInfo.unary === undefined)
		return true; // definitely binary
	if (previousBinaryOperatorTypes.has(previousToken.type))
		return true;
	return false;
}

function shouldStartGenericTypeExpression(previousToken, nextToken) {
	if (nextToken.val !== '<')
		return false;
	if (previousToken.type !== ParseTreeTokenType.DATA_TYPE &&
	previousToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	if (previousToken.type === ParseTreeTokenType.IDENTIFIER) {
		const parent = previousToken.parentNode;
		if (parent === null || parent.type !== ParseTreeTokenType.NEW)
			return false;
	}
	return true;
}

function shouldEndGenericTypeExpression(previousToken, nextToken) {
	if (nextToken.val !== '>')
		return false;
	previousToken = getClosestOfType(previousToken, ParseTreeTokenType.GENERIC_TYPE_EXPRESSION);
	if (previousToken === null || previousToken.type !== ParseTreeTokenType.GENERIC_TYPE_EXPRESSION)
		return false;
	const children = previousToken.children;
	if (children[children.length - 1].type === ParseTreeTokenType.GENERIC_RIGHT_BRACKET)
		return false;
	return true;
}

function shouldAppendNextForUnaryOperator(previousToken, nextToken) {
	const operatorInfo = Operators.getOperatorInfo(nextToken.val);
	if (operatorInfo.unary.mayBePrefix === true) {
		if (previousToken.type === ParseTreeTokenType.IDENTIFIER)
			return true;
	}
	return false;
}

function isGoodPreviousToken(previousToken, nextToken) {
	if (previousToken.type === ParseTreeTokenType.FUNCTION && nextToken.val !== '*')
		return false;
	if (badPreviousTokenTypes.has(previousToken.type))
		return false;
	if (nextToken.type !== ParseTreeTokenType.UNARY_OPERATOR) {
		const parent = previousToken.parentNode;
		if (parent !== null) {
			if (parent.type === ParseTreeTokenType.DOT)
				return false;
		}
	}
	return true;
}

function getGoodPreviousToken(previousToken, nextToken) {
	if (previousToken.type === ParseTreeTokenType.DECLARATION &&
	previousToken.children.length >= 2 &&
	nextToken.val === '=') {
		const children = previousToken.children;
		const lastChild = children[children.length - 1];
		if (lastChild.type === ParseTreeTokenType.IDENTIFIER)
			return lastChild;
	}
	while (!isGoodPreviousToken(previousToken, nextToken))
		previousToken = previousToken.parentNode;
	return previousToken;
}

export function processOperator(previousToken, nextToken) {
	if (previousToken.type === ParseTreeTokenType.DOT && nextToken.val === '*') {
		nextToken.type = ParseTreeTokenType.WILDCARD;
		previousToken.appendChild(nextToken);
		const closestImport = getClosestOfType(previousToken, ParseTreeTokenType.IMPORT);
		if (closestImport !== null)
			return closestImport.parentNode;
		return nextToken;
	}
	if (addCodeBlockIfNeeded(previousToken, nextToken)) {
		return nextToken;
	}
	setCodeBlockParentIfNeeded(previousToken);
	previousToken = getGoodPreviousToken(previousToken, nextToken);
	const operatorInfo = Operators.getOperatorInfo(nextToken.val);
	if (shouldStartGenericTypeExpression(previousToken, nextToken)) {
		const e = new ParseTreeToken(null, previousToken.lineIndex, previousToken.colIndex, ParseTreeTokenType.GENERIC_TYPE_EXPRESSION);
		nextToken.type = ParseTreeTokenType.GENERIC_LEFT_BRACKET;
		previousToken.appendChild(e);
		e.appendChild(nextToken);
		return e;
	}
	else if (shouldEndGenericTypeExpression(previousToken, nextToken)) {
		previousToken = getClosestOfType(previousToken, ParseTreeTokenType.GENERIC_TYPE_EXPRESSION);
		nextToken.type = ParseTreeTokenType.GENERIC_RIGHT_BRACKET;
		previousToken.appendChild(nextToken);
		return previousToken.parentNode;
	}
	else if (shouldBeTreatedAsBinaryOperator(previousToken, nextToken)) {
		if (previousToken.parentNode === null)
			previousToken.appendChild(nextToken);
		else {
			if (shouldBecomeDeclaration(previousToken)) {
				addDeclaration(previousToken);
			}
			previousToken = getTopCompleteExpressionToken(previousToken, true);
			if (previousToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
			!endsWithClosingCurvedBracket(previousToken)) {
				if (previousToken.children.length === 2) {
					const t = previousToken.children[1];
					t.remove();
					nextToken.appendChild(t);
				}
				previousToken.appendChild(nextToken);
			}
			else {
				previousToken.parentNode.appendChild(nextToken);
				nextToken.appendChild(previousToken);
			}
		}
	}
	else {
		nextToken.type = ParseTreeTokenType.UNARY_OPERATOR;
		// treat as unary for now.
		if (shouldAppendNextForUnaryOperator(previousToken, nextToken))
			previousToken.appendChild(nextToken);
		else
			addToken(previousToken, nextToken);
	}
};