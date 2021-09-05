import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const noChildTypes = new Set([
	ParseTreeTokenType.CLASS_NAME_SELECTOR,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMBINATOR,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.NUMBER_UNIT_LITERAL,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.WILDCARD,
]);

const twoChildTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.COMBINATOR,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.RULE_SET
]);

function isCompleteAttributeSelector(token) {
	if (token.children.length < 2)
		return false;
	const lastChild = token.children[token.children.length - 1];
	if (lastChild.type === ParseTreeTokenType.SQUARE_RIGHT_BRACKET)
		return true;
}

function isCompleteCurvedBracketExpression(token) {
	if (token.children.length < 2)
		return false;
	const lastChild = token.children[token.children.length - 1];
	return lastChild.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET;
}

function isCompleteDeclarationBlock(token) {
	if (token.children.length < 2)
		return false;
	const lastChild = token.children[token.children.length - 1];
	return lastChild.type === ParseTreeTokenType.CURLY_RIGHT_BRACKET;
}

function isCompleteDeclaration(token) {
	if (token.children.length < 3)
		return false;
	if (token.children.length > 3) {
		const lastChild = token.children[token.children.length - 1];
		if (lastChild.type === ParseTreeTokenType.SEMICOLON)
			return true;
	}
}

function isCompletePseudoClass(token) {
	if (token.children.length >= 1)
		return true;
}

function isCompleteSelector(token) {
	if (token.children.length === 0)
		return false;
}

function isCompleteUnaryOperator(token) {
	return token.children.length === 1;
}

const typeCheckers = new Map([
	[ParseTreeTokenType.ARG_LIST, isCompleteCurvedBracketExpression],
	[ParseTreeTokenType.ATTRIBUTE_SELECTOR, isCompleteAttributeSelector],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, isCompleteCurvedBracketExpression],
	[ParseTreeTokenType.DECLARATION, isCompleteDeclaration],
	[ParseTreeTokenType.DECLARATION_BLOCK, isCompleteDeclarationBlock],
	[ParseTreeTokenType.PSEUDO_CLASS, isCompletePseudoClass],
	[ParseTreeTokenType.SELECTOR, isCompleteSelector],
	[ParseTreeTokenType.UNARY_OPERATOR, isCompleteUnaryOperator]
]);

export function isCompleteValueToken(token) {
	if (noChildTypes.has(token.type))
		return true;
	if (twoChildTypes.has(token.type))
		return token.children.length >= 2;
	const checker = typeCheckers.get(token.type);
	if (checker !== undefined)
		return checker(token);
};