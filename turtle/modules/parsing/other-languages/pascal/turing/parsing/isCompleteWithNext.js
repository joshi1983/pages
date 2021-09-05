import { canEvaluateToDataValue } from
'./canEvaluateToDataValue.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { SetUtils } from
'../../../../../SetUtils.js';

const noChildTypes = new Set([
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.END,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.THEN
]);
const oneChildTypes = new Set([
	ParseTreeTokenType.DATA_TYPE_EXPRESSION,
	ParseTreeTokenType.RESULT,
	ParseTreeTokenType.UNARY_OPERATOR
]);
const twoChildTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.END_CLASS,
	ParseTreeTokenType.END_FOR,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.END_LOOP,
	ParseTreeTokenType.END_PROCEDURE
]);

const previousOperandTokenTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR
]);
const parentTypesArray = [
	[ParseTreeTokenType.COLON, [
		ParseTreeTokenType.CONST,
		ParseTreeTokenType.FOR,
		ParseTreeTokenType.FORMAL_ARG_LIST,
		ParseTreeTokenType.VAR
	]],
	[ParseTreeTokenType.COMMA, [
		ParseTreeTokenType.ARG_LIST,
		ParseTreeTokenType.COMMA_LIST,
		ParseTreeTokenType.CONST,
			// not sure if const x,y := 3 is valid in Turing but we'll parse it as valid.
		ParseTreeTokenType.EXPORT,
		ParseTreeTokenType.FORMAL_ARG_LIST,
		ParseTreeTokenType.VAR
	]],
	[ParseTreeTokenType.END, [
		ParseTreeTokenType.CLASS,
		ParseTreeTokenType.FOR,
		ParseTreeTokenType.FUNCTION,
		ParseTreeTokenType.IF,
		ParseTreeTokenType.LOOP,
		ParseTreeTokenType.PROCEDURE
	]],
	[ParseTreeTokenType.ELSE, [
		ParseTreeTokenType.IF
	]],
	[ParseTreeTokenType.ELSIF, [
		ParseTreeTokenType.IF
	]],
	[ParseTreeTokenType.EXPORT, [
		ParseTreeTokenType.CLASS,
		ParseTreeTokenType.CLASS_BODY
	]],
	[ParseTreeTokenType.THEN, [
		ParseTreeTokenType.ELSIF,
		ParseTreeTokenType.IF,
	]]
];
const parentTypesMap = new Map();
for (const typesInfo of parentTypesArray) {
	parentTypesMap.set(typesInfo[0], new Set(typesInfo[1]));
}

export const declarationTypes = new Set([
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.VAR
]);

const dteCompleteNextTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.CLASS,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.END,
	ParseTreeTokenType.EXPORT,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.VAR
]);

const completeIdentifierParentTypes = new Set([
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_PROCEDURE,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.PROCEDURE
]);
const identifierCompleteNextTypes = new Set([
	ParseTreeTokenType.CLASS,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.END,
	ParseTreeTokenType.EXIT,
	ParseTreeTokenType.EXPORT,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.PROCEDURE,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.THEN,
	ParseTreeTokenType.VAR,
	ParseTreeTokenType.WHEN
]);
const varCompleteNextTypes = new Set([
	ParseTreeTokenType.CURVED_LEFT_BRACKET
]);
SetUtils.addAll(varCompleteNextTypes, identifierCompleteNextTypes);

function endsWith(lastChildType) {
	return function(token) {
		const children = token.children;
		const lastChild = children[children.length - 1];
		return lastChild !== undefined && lastChild.type === lastChildType;
	}
}

function isAssignmentOperatorComplete(prev, next) {
	if (prev.children.length >= 2)
		return true;

	if (declarationTypes.has(prev.parentNode.type)) {
		const prevPrev = prev.getPreviousSibling();
		if (prevPrev !== null &&
		prevPrev.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
			return prev.children.length >= 1;
	}

	return false;
}

function isDataTypeExpressionComplete(prev, next) {
	if (dteCompleteNextTypes.has(next.type))
		return true;
	return false;
}

function isIdentifierComplete(prev, next) {
	const prevParent = prev.parentNode;
	if (completeIdentifierParentTypes.has(prevParent.type))
		return true;

	if (identifierCompleteNextTypes.has(next.type))
		return true;

	if (prevParent.type === ParseTreeTokenType.OF ||
	prevParent.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
		return true;

	return false;
}

function isVarComplete(prev, next) {
	const children = prev.children;
	if (children.length === 0)
		return false;

	const lastChild = children[children.length - 1];
	if (lastChild.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return true;

	if (!children.some(c => c.type === ParseTreeTokenType.COLON))
		return false;

	if (varCompleteNextTypes.has(next.type))
		return true;
	
	return false;
}

const typeCheckers = new Map([
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, isAssignmentOperatorComplete],
	[ParseTreeTokenType.CONST, endsWith(ParseTreeTokenType.ASSIGNMENT_OPERATOR)],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, endsWith(ParseTreeTokenType.CURVED_RIGHT_BRACKET)],
	[ParseTreeTokenType.DATA_TYPE_EXPRESSION, isDataTypeExpressionComplete],
	[ParseTreeTokenType.FORMAL_ARG_LIST, endsWith(ParseTreeTokenType.CURVED_RIGHT_BRACKET)],
	[ParseTreeTokenType.FUNCTION, endsWith(ParseTreeTokenType.END_FUNCTION)],
	[ParseTreeTokenType.FUNCTION_CALL, endsWith(ParseTreeTokenType.ARG_LIST)],
	[ParseTreeTokenType.IDENTIFIER, isIdentifierComplete],
	[ParseTreeTokenType.PROCEDURE, endsWith(ParseTreeTokenType.END_PROCEDURE)],
	[ParseTreeTokenType.VAR, isVarComplete]
]);

export function isCompleteWithNext(prev, next) {
	if (prev.parentNode === null)
		return false; // can't go above the root of the tree

	if (!previousOperandTokenTypes.has(next.type) ||
	!canEvaluateToDataValue(prev)) {
		if (noChildTypes.has(prev.type))
			return true;

		const prevChildren = prev.children;
		if (prevChildren.length >= 2 &&
		twoChildTypes.has(prev.type))
			return true;
			
		if (prevChildren.length >= 1 &&
		oneChildTypes.has(prev.type))
			return true;

		let checker = typeCheckers.get(prev.type);
		if (checker !== undefined)
			return checker(prev, next);
	}

	if (next.val === ':=' &&
	next.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	(prev.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION ||
	prev.parentNode.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION))
		return true;

	const parentTypesInfo = parentTypesMap.get(next.type);
	if (parentTypesInfo !== undefined) {
		return !parentTypesInfo.has(prev.type);
	}

	return false;
};