import { getClosestOfTypes } from '../../generic-parsing-utilities/getClosestOfTypes.js';
import { Operators } from '../Operators.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

// Some types should never have children.
const noChildTypes = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.BREAK,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CONTINUE,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.NULL,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.QUESTION_MARK,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.VOID
]);

const typesWith1Child = new Set([
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.ELSE,
	ParseTreeTokenType.ELSE_IF,
	ParseTreeTokenType.STATIC,
	ParseTreeTokenType.UNARY_OPERATOR
]);

const typesWith2Children = new Set([
	ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR,
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.CONSTRUCTOR,
	ParseTreeTokenType.DO, // 1. code block and then 2. while.
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
	ParseTreeTokenType.METHOD_CALL
]);

const typesWith3Children = new Set([
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.INDEX_EXPRESSION
]);

function getExpectedChildrenLengthForUnaryOperator(token) {
	const info = Operators.getOperatorInfo(token.val);
	if (info.unary.mayBePrefix) {
		if (token.parentNode !== null && token.parentNode.type === ParseTreeTokenType.IDENTIFIER)
			return 0; // For example, i++ or i--
		if (token.children.length !== 0)
			return 1; // For example, ++i or --i
		return undefined; // either 1 or 0 but unknown which.
	}
	return 1;
}

function getExpectedChildrenLengthForColon(token) {
	if (token.parentNode.type === ParseTreeTokenType.CURLY_BRACKET_EXPRESSION)
		return 2;
	return 0;
}

function getExpectedChildrenLengthForDeclaration(token) {
	const parent = token.parentNode;
	if (parent !== null && parent.type === ParseTreeTokenType.ARG_LIST)
		return 2;
	return undefined; // We want to say 2 or more but undefined is as good as possible for now.
}

function getExpectedChildrenLengthForMethod(token) {
	const classOrInterface = getClosestOfTypes(token, [ParseTreeTokenType.CLASS, ParseTreeTokenType.INTERFACE]);
	// check if the method is abstract.
	// abstract methods don't need a CODE_BLOCK as a child.
	if (classOrInterface !== null && classOrInterface.type === ParseTreeTokenType.INTERFACE)
		return 3;
	return 4;
}

const typeToFunction = new Map([
	[ParseTreeTokenType.COLON, getExpectedChildrenLengthForColon],
	[ParseTreeTokenType.DECLARATION, getExpectedChildrenLengthForDeclaration],
	[ParseTreeTokenType.METHOD, getExpectedChildrenLengthForMethod],
	[ParseTreeTokenType.UNARY_OPERATOR, getExpectedChildrenLengthForUnaryOperator]
]);

export function getExpectedChildrenLengthForToken(token) {
	const specialFunc = typeToFunction.get(token.type);
	if (specialFunc !== undefined)
		return specialFunc(token);
	if (noChildTypes.has(token.type))
		return 0;
	if (typesWith1Child.has(token.type))
		return 1;
	if (typesWith2Children.has(token.type))
		return 2;
	if (typesWith3Children.has(token.type))
		return 3;
	if (token.type === ParseTreeTokenType.CONDITIONAL_TERNARY)
		return 5;
};