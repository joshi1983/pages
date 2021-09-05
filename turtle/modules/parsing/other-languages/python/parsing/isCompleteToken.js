import { getExpectedChildrenLengthForToken } from './getExpectedChildrenLengthForToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isCompleteCurvedBracketExpression(token) {
	const children = token.children;
	if (children.length === 0)
		return false;
	if (children[0].type === ParseTreeTokenType.CURVED_LEFT_BRACKET)
		return children[children.length - 1].type === ParseTreeTokenType.CURVED_RIGHT_BRACKET;
	return false;
}

function isIdentifierComplete(prev) {
	if (prev.parentNode.type === ParseTreeTokenType.CLASS)
		return true;
	if (prev.children.length === 0) {
		return false;
	}
	return true;
}

function isInComplete(prev) {
	const parent = prev.parentNode;
	if (parent.type === ParseTreeTokenType.FOR_LOOP)
		return true;
	return false;
}

function isCompleteDecorator(token) {
	if (token.children.length === 0)
		return false; // might be complete.
		// If the next token is (, the decorator is not complete.

	return true;
}

function isCompleteDictionaryLiteral(token) {
	const children = token.children;
	if (children.length < 2)
		return false;
	const last = children[children.length - 1];
	return last.type === ParseTreeTokenType.CURLY_RIGHT_BRACKET;
}

function isCompleteFunctionDefinition(token) {
	const children = token.children;
	if (children.length < 5)
		return false;// The shortest possible is with this format: def name arglist : codeblock

	const last = children[children.length - 1];
	return last.type === ParseTreeTokenType.CODE_BLOCK;
}

function isCompleteSquareBracketExpression(token) {
	const children = token.children;
	if (children.length < 2)
		return false;
	if (children[0].type === ParseTreeTokenType.SQUARE_LEFT_BRACKET)
		return children[children.length - 1].type === ParseTreeTokenType.SQUARE_RIGHT_BRACKET;
	return false;
}

function isCompleteReturn(token) {
	// return with 0 arguments can be complete too.
	// We'll see if any change is needed to reflect that later.
	return token.children.length >= 1;
};

function isEndingWithCodeBlock(token) {
	const children = token.children;
	if (children.length < 1)
		return false;
	const last = children[children.length - 1];
	return last.type === ParseTreeTokenType.CODE_BLOCK;
}

const checkers = new Map([
	[ParseTreeTokenType.ARGUMENT_LIST, isCompleteCurvedBracketExpression],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, isCompleteCurvedBracketExpression],
	[ParseTreeTokenType.DECORATOR, isCompleteDecorator],
	[ParseTreeTokenType.DICTIONARY_LITERAL, isCompleteDictionaryLiteral],
	[ParseTreeTokenType.FOR_LOOP, isEndingWithCodeBlock],
	[ParseTreeTokenType.FUNCTION_DEFINITION, isCompleteFunctionDefinition],
	[ParseTreeTokenType.IDENTIFIER, isIdentifierComplete],
	[ParseTreeTokenType.IN, isInComplete],
	[ParseTreeTokenType.LIST_LITERAL, isCompleteSquareBracketExpression],
	[ParseTreeTokenType.RETURN, isCompleteReturn],
	[ParseTreeTokenType.SUBSCRIPT, isCompleteSquareBracketExpression],
	[ParseTreeTokenType.TUPLE_LITERAL, isCompleteCurvedBracketExpression],
	[ParseTreeTokenType.WHILE_LOOP, isEndingWithCodeBlock],
]);

export function isCompleteToken(token) {
	const checker = checkers.get(token.type);
	if (checker !== undefined)
		return checker(token);

	const expectedLength = getExpectedChildrenLengthForToken(token);
	if (expectedLength !== undefined) {
		return token.children.length >= expectedLength;
	}
	return false;
};