import { ArrayUtils } from
'../../../../../ArrayUtils.js';
import { canEvaluateToDataValue } from
'./canEvaluateToDataValue.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { typesMap } from './processEnd.js';
import { SetUtils } from
'../../../../../SetUtils.js';

export const noChildTypes = new Set([
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURLY_LEFT_BRACKET,
	ParseTreeTokenType.CURLY_RIGHT_BRACKET,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.DECREASING,
	ParseTreeTokenType.END,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.RETURN,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.THEN
]);
export const oneChildTypes = new Set([
	ParseTreeTokenType.ASSERT,
	ParseTreeTokenType.BODY,
	ParseTreeTokenType.DATA_TYPE_EXPRESSION,
	ParseTreeTokenType.DEFERRED,
	ParseTreeTokenType.EXIT,
	ParseTreeTokenType.EXTERNAL,
	ParseTreeTokenType.FORK,
	ParseTreeTokenType.RESULT,
	ParseTreeTokenType.UNARY_OPERATOR,
	ParseTreeTokenType.WHEN
]);
export const twoChildTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.END_CASE,
	ParseTreeTokenType.END_CLASS,
	ParseTreeTokenType.END_FOR,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.END_LOOP,
	ParseTreeTokenType.END_PROCEDURE,
	ParseTreeTokenType.END_PROCESS,
	ParseTreeTokenType.END_RECORD,
	ParseTreeTokenType.END_UNION
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
		ParseTreeTokenType.LABEL,
		ParseTreeTokenType.TYPE,
		ParseTreeTokenType.UNION,
		ParseTreeTokenType.VAR
	]],
	[ParseTreeTokenType.COMMA, [
		ParseTreeTokenType.ARG_LIST,
		ParseTreeTokenType.COMMA_LIST,
		ParseTreeTokenType.CONST,
			// not sure if const x,y := 3 is valid in Turing but we'll parse it as valid.
		ParseTreeTokenType.EXPORT,
		ParseTreeTokenType.FORMAL_ARG_LIST,
		ParseTreeTokenType.LABEL,
		ParseTreeTokenType.VAR
	]],
	[ParseTreeTokenType.CURVED_RIGHT_BRACKET, [
		ParseTreeTokenType.ARG_LIST,
		ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
		ParseTreeTokenType.FORMAL_ARG_LIST
	]],
	[ParseTreeTokenType.ELSE, [
		ParseTreeTokenType.IF
	]],
	[ParseTreeTokenType.ELSIF, [
		ParseTreeTokenType.IF
	]],
	[ParseTreeTokenType.EXPORT, [
		ParseTreeTokenType.CLASS,
		ParseTreeTokenType.CLASS_BODY,
		ParseTreeTokenType.MODULE,
		ParseTreeTokenType.MODULE_BODY
	]],
	[ParseTreeTokenType.FUNCTION, [
		ParseTreeTokenType.BODY,
		ParseTreeTokenType.CLASS,
		ParseTreeTokenType.CLASS_BODY,
		ParseTreeTokenType.DEFERRED,
		ParseTreeTokenType.MODULE,
		ParseTreeTokenType.MODULE_BODY
	]],
	[ParseTreeTokenType.LABEL, [
		ParseTreeTokenType.CASE,
		ParseTreeTokenType.UNION
	]],
	[ParseTreeTokenType.OF, [
		ParseTreeTokenType.CONTAINER_TYPE,
		ParseTreeTokenType.CASE,
		ParseTreeTokenType.UNION
	]],
	[ParseTreeTokenType.PROCEDURE, [
		ParseTreeTokenType.BODY,
		ParseTreeTokenType.CLASS,
		ParseTreeTokenType.CLASS_BODY,
		ParseTreeTokenType.DEFERRED,
		ParseTreeTokenType.MODULE,
		ParseTreeTokenType.MODULE_BODY
	]],
	[ParseTreeTokenType.THEN, [
		ParseTreeTokenType.ELSIF,
		ParseTreeTokenType.IF
	]]
];
parentTypesArray.push([ParseTreeTokenType.END, ArrayUtils.combine(Array.from(typesMap.values()),
Array.from(typesMap.keys()))]);
const parentTypesMap = new Map();
for (const typesInfo of parentTypesArray) {
	parentTypesMap.set(typesInfo[0], new Set(typesInfo[1]));
}

export const declarationTypes = new Set([
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.VAR
]);

const argListCompleteNextTypes = new Set([
	ParseTreeTokenType.CLASS,
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.END,
	ParseTreeTokenType.EXPORT,
	ParseTreeTokenType.SEMICOLON,
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
	ParseTreeTokenType.END_CASE,
	ParseTreeTokenType.END_FOR,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_LOOP,
	ParseTreeTokenType.END_MODULE,
	ParseTreeTokenType.END_PROCEDURE,
	ParseTreeTokenType.END_PROCESS,
	ParseTreeTokenType.END_RECORD,
	ParseTreeTokenType.END_UNION,
	ParseTreeTokenType.FOR,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.PROCEDURE,
	ParseTreeTokenType.PROCESS
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
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.OF,
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
varCompleteNextTypes.delete(ParseTreeTokenType.IDENTIFIER);

function endsWith(lastChildType) {
	return function(token) {
		const children = token.children;
		const lastChild = children[children.length - 1];
		return lastChild !== undefined && lastChild.type === lastChildType;
	}
}

function isArgListComplete(prev, next) {
	if (argListCompleteNextTypes.has(next.type))
		return true;

	const children = prev.children;
	if (children.length === 0)
		return false;

	const first = children[0];
	const last = children[children.length - 1];
	if (first.type === ParseTreeTokenType.CURVED_LEFT_BRACKET) {
		if (last.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET)
			return true;
		return false;
	}

	if (next.lineIndex !== last.lineIndex)
		return true;
		// for example,
		// put "hi"
		// put % this should not be treated like part of the first put's argument list.

	return false;
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

function isContainerTypeComplete(prev, next) {
	if (next.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return true;

	const prevChildren = prev.children;
	const lastChild = prevChildren[prevChildren.length - 1];
	if (prevChildren.length < 2 &&
	prev.val.toLowerCase() === 'array')
		return false;

	return lastChild !== undefined &&
		lastChild.type === ParseTreeTokenType.OF;
}

function isDataTypeExpressionComplete(prev, next) {
	const prevChildren = prev.children;
	if (prevChildren.length === 0)
		return false;

	if (dteCompleteNextTypes.has(next.type))
		return true;

	if (next.type === ParseTreeTokenType.IDENTIFIER)
		return true;

	return false;
}

function isExportComplete(prev, next) {
	if (next.type === ParseTreeTokenType.BODY ||
	next.type === ParseTreeTokenType.CONST ||
	next.type === ParseTreeTokenType.DEFERRED ||
	next.type === ParseTreeTokenType.EXPORT ||
	next.type === ParseTreeTokenType.IMPORT ||
	next.type === ParseTreeTokenType.PROCEDURE ||
	next.type === ParseTreeTokenType.VAR)
		return true;

	const children = prev.children;
	const lastChild = children[children.length - 1];
	if (lastChild === undefined)
		return false;

	if (lastChild.type !== ParseTreeTokenType.COMMA &&
	next.type !== ParseTreeTokenType.COMMA)
		return true;
		
	return false;
}

function isFunctionComplete(prev, next) {
	if (endsWith(ParseTreeTokenType.END_FUNCTION)(prev, next))
		return true;

	const prevParent = prev.parentNode;
	if (prevParent.type !== ParseTreeTokenType.DEFERRED &&
	prevParent.type !== ParseTreeTokenType.DATA_TYPE_EXPRESSION)
		return false;

	const children = prev.children;
	const lastChild = children[children.length - 1];
	if (lastChild === undefined)
		return false;

	if (lastChild.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
		return true;

	return false;
}

function isGenericMarkedEnding(endingType) {
	return function(prev, next) {
		if (prev.parentNode.type === endingType)
			return true;

		const children = prev.children;
		const lastChild = children[children.length - 1];
		if (lastChild === undefined)
			return false;

		if (lastChild.type === endingType)
			return true;

		return false;
	};
}

function isIdentifierComplete(prev, next) {
	const prevParent = prev.parentNode;
	if (completeIdentifierParentTypes.has(prevParent.type))
		return true;

	if (identifierCompleteNextTypes.has(next.type))
		return true;

	if (prevParent.type === ParseTreeTokenType.ASSERT ||
	prevParent.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION ||
	prevParent.type === ParseTreeTokenType.FORK) {
		if (prev.type === ParseTreeTokenType.IDENTIFIER &&
		next.type === ParseTreeTokenType.CURVED_LEFT_BRACKET)
			return false; // for example, string( in string(20)
		return true;
	}

	if (prevParent.type === ParseTreeTokenType.OF)
		return true;

	return false;
}

function isLabelComplete(prev, next) {
	const children = prev.children;
	if (children.length === 0)
		return false;

	const lastChild = children[children.length - 1];
	if (lastChild.type === ParseTreeTokenType.COLON)
		return true;

	if (next.type === ParseTreeTokenType.COLON)
		return false;

	if (children.length > 2)
		return true; // having more than 2 children is not valid.
		// Let's mitigate the problem by considering it complete.

	return false;
}

function isOfComplete(prev, next) {
	if (next.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return true;

	const children = prev.children;
	const lastChild = children[children.length - 1];
	if (lastChild === undefined)
		return false;
	
	if (lastChild.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
		return true;
	
	return children.length > 1;
}

function isProcedureComplete(prev, next) {
	if (endsWith(ParseTreeTokenType.END_PROCEDURE)(prev, next))
		return true;

	const prevParent = prev.parentNode;
	if (prevParent.type !== ParseTreeTokenType.DEFERRED &&
	prevParent.type !== ParseTreeTokenType.DATA_TYPE_EXPRESSION)
		return false;

	const children = prev.children;
	const lastChild = children[children.length - 1];
	if (lastChild === undefined)
		return false;

	if (lastChild.type === ParseTreeTokenType.FORMAL_ARG_LIST)
		return true;

	return false;
}

function isTypeComplete(prev, next) {
	const children = prev.children;
	if (children.length > 3)
		return true; // 3 is normal for a complete type.
		// more than that indicates a problem.
		// return true to prevent the problem from getting worse.

	const lastChild = children[children.length - 1];
	if (lastChild === undefined)
		return false;

	if (lastChild.type === ParseTreeTokenType.RECORD ||
	lastChild.type === ParseTreeTokenType.UNION ||
	lastChild.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION ||
	lastChild.type === ParseTreeTokenType.BINARY_OPERATOR)
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
	if (lastChild.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION &&
	next.type !== ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return true;

	if (!children.some(c => c.type === ParseTreeTokenType.COLON))
		return false;

	if (varCompleteNextTypes.has(next.type))
		return true;
	
	return false;
}

const typeCheckers = new Map([
	[ParseTreeTokenType.ARG_LIST, isArgListComplete],
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, isAssignmentOperatorComplete],
	[ParseTreeTokenType.CASE, isGenericMarkedEnding(ParseTreeTokenType.END_CASE)],
	[ParseTreeTokenType.CONST, endsWith(ParseTreeTokenType.ASSIGNMENT_OPERATOR)],
	[ParseTreeTokenType.CONTAINER_TYPE, isContainerTypeComplete],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, endsWith(ParseTreeTokenType.CURVED_RIGHT_BRACKET)],
	[ParseTreeTokenType.DATA_TYPE_EXPRESSION, isDataTypeExpressionComplete],
	[ParseTreeTokenType.EXPORT, isExportComplete],
	[ParseTreeTokenType.FOR, isGenericMarkedEnding(ParseTreeTokenType.END_FOR)],
	[ParseTreeTokenType.FORMAL_ARG_LIST, endsWith(ParseTreeTokenType.CURVED_RIGHT_BRACKET)],
	[ParseTreeTokenType.FUNCTION, isFunctionComplete],
	[ParseTreeTokenType.FUNCTION_CALL, endsWith(ParseTreeTokenType.ARG_LIST)],
	[ParseTreeTokenType.IDENTIFIER, isIdentifierComplete],
	[ParseTreeTokenType.IF, isGenericMarkedEnding(ParseTreeTokenType.END_IF)],
	[ParseTreeTokenType.LABEL, isLabelComplete],
	[ParseTreeTokenType.LOOP, isGenericMarkedEnding(ParseTreeTokenType.END_LOOP)],
	[ParseTreeTokenType.MODULE, isGenericMarkedEnding(ParseTreeTokenType.END_MODULE)],
	[ParseTreeTokenType.OF, isOfComplete],
	[ParseTreeTokenType.PROCEDURE, isProcedureComplete],
	[ParseTreeTokenType.RECORD, isGenericMarkedEnding(ParseTreeTokenType.END_RECORD)],
	[ParseTreeTokenType.TYPE, isTypeComplete],
	[ParseTreeTokenType.UNION, isGenericMarkedEnding(ParseTreeTokenType.END_UNION)],
	[ParseTreeTokenType.VAR, isVarComplete]
]);

function mightCreateFunctionCall(prev, next) {
	if (next.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET)
		return false;
	if (prev.type === ParseTreeTokenType.IDENTIFIER &&
	prev.children.length === 0)
		return true;

	return false;
}

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
		oneChildTypes.has(prev.type)) {
			if (prevChildren.length === 1 && mightCreateFunctionCall(prev, next))
				return false;
			return true;
		}

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