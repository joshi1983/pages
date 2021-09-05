import { addCodeBlockIfNeeded } from './addCodeBlockIfNeeded.js';
import { addToken } from './addToken.js';
import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { getTopCompleteExpressionToken } from './getTopCompleteExpressionToken.js';
import { Operators } from '../Operators.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

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
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TEMPLATE_LITERAL,
	ParseTreeTokenType.THIS,
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
	const grandparent = parent.parentNode;
	if (grandparent !== null && grandparent.type === ParseTreeTokenType.IMPORT)
		return;
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

function shouldAppendNextForUnaryOperator(previousToken, nextToken) {
	const operatorInfo = Operators.getOperatorInfo(nextToken.val);
	if (operatorInfo.unary.mayBePrefix === true) {
		if (previousToken.type === ParseTreeTokenType.IDENTIFIER)
			return true;
	}
	return false;
}

function isGoodPreviousToken(previousToken, nextToken) {
	if (previousToken.type === ParseTreeTokenType.IDENTIFIER &&
	previousToken.parentNode.type === ParseTreeTokenType.DOT &&
	nextToken.val !== '--' && nextToken.val !== '++')
		return false;
	if (previousToken.type === ParseTreeTokenType.FUNCTION && nextToken.val !== '*')
		return false;
	if (nextToken.val === 'as' && previousToken.type === ParseTreeTokenType.WILDCARD)
		return true;
	const parent = previousToken.parentNode;
	if (badPreviousTokenTypes.has(previousToken.type)) {
		if (parent.type === ParseTreeTokenType.CODE_BLOCK)
			return true;
		return false;
	}
	return true;
}

function getGoodPreviousToken(previousToken, nextToken) {
	if (nextToken.val === 'as' &&
	previousToken.type === ParseTreeTokenType.EXPORT &&
	previousToken.children.length === 1 &&
	previousToken.children[0].type === ParseTreeTokenType.WILDCARD)
		return previousToken.children[0];
	if (nextToken.val === 'void' && previousToken.type === ParseTreeTokenType.DOT &&
	previousToken.children.length === 0)
		return previousToken;
	while (!isGoodPreviousToken(previousToken, nextToken))
		previousToken = previousToken.parentNode;
	return previousToken;
}

export function processOperator(previousToken, nextToken) {
	if (addCodeBlockIfNeeded(previousToken, nextToken)) {
		return nextToken;
	}
	setCodeBlockParentIfNeeded(previousToken);
	previousToken = getGoodPreviousToken(previousToken, nextToken);
	const operatorInfo = Operators.getOperatorInfo(nextToken.val);
	if (operatorInfo.symbol === '*' && previousToken.type === ParseTreeTokenType.FUNCTION) {
		nextToken.type = ParseTreeTokenType.GENERATOR_STAR;
		previousToken.appendChild(nextToken);
	}
	else if (operatorInfo.symbol === '*' && previousToken.type === ParseTreeTokenType.EXPORT &&
	previousToken.children.length === 0) {
		nextToken.type = ParseTreeTokenType.WILDCARD;
		previousToken.appendChild(nextToken);
		return previousToken;
	}
	else if (shouldBeTreatedAsBinaryOperator(previousToken, nextToken)) {
		if (previousToken.parentNode === null)
			previousToken.appendChild(nextToken);
		else {
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
				if (previousToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
				operatorInfo.symbol === '=>') {
					previousToken.type = ParseTreeTokenType.ARG_LIST; // argument list for function definition.
				}
				previousToken.parentNode.appendChild(nextToken);
				nextToken.appendChild(previousToken);
				if (previousToken.type === ParseTreeTokenType.LET)
					previousToken.type = ParseTreeTokenType.IDENTIFIER;
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