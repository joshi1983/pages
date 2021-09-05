import { Command } from '../../Command.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { PovRayCommand } from '../PovRayCommand.js';
await Command.asyncInit();

export class ExpectedChildrenResult {
	static RIGIDLY_EQUAL = 0;
	static LOSELY_EQUAL = 1;
	static TOO_FEW = 2;
	static TOO_MANY = 3;
	// have all children and can't have more.
	// have all needed but could get more.
	// don't have all children.  need more
	static canBeComplete(val) {
		return val === ExpectedChildrenResult.RIGIDLY_EQUAL ||
		val === ExpectedChildrenResult.LOSELY_EQUAL;
	}
};

function isBalancedExpression(token, closingType) {
	if (token.children.length < 2)
		return ExpectedChildrenResult.TOO_FEW;
	const children = token.children;
	const lastChild = children[children.length - 1];
	if (lastChild.type !== closingType)
		return ExpectedChildrenResult.TOO_FEW;
	return ExpectedChildrenResult.RIGIDLY_EQUAL;
}

function isCompleteArgList(token) {
	return isBalancedExpression(token, ParseTreeTokenType.CURVED_RIGHT_BRACKET);
}

function isCompleteArray(token) {
	if (token.children.length >= 1)
		return ExpectedChildrenResult.LOSELY_EQUAL;
	return ExpectedChildrenResult.TOO_FEW;
}

function isCompleteCase(token) {
	if (token.children.length === 0)
		return ExpectedChildrenResult.TOO_FEW;
	const lastChild = token.children[token.children.length - 1];
	if (lastChild.type !== ParseTreeTokenType.INSTRUCTION_LIST)
		return ExpectedChildrenResult.TOO_FEW;

	return ExpectedChildrenResult.RIGIDLY_EQUAL;
}

function isCompleteCodeBlock(token) {
	return isBalancedExpression(token, ParseTreeTokenType.CURLY_RIGHT_BRACKET);
}

function isCompleteCurlyBracketExpression(token) {
	return isBalancedExpression(token, ParseTreeTokenType.CURLY_RIGHT_BRACKET);
}

function isCompleteCurvedBracketExpression(token) {
	return isBalancedExpression(token, ParseTreeTokenType.CURVED_RIGHT_BRACKET);
}

function isCompleteParameterizedGroup(token) {
	const info = PovRayCommand.getCommandInfo(token.val);
	if (info !== undefined) {
		if (info.args !== undefined) {
			if (info.args.length > token.children.length)
				return ExpectedChildrenResult.TOO_FEW;
			if (info.args.length === token.children.length)
				return ExpectedChildrenResult.RIGIDLY_EQUAL;
		}
		if (info.to !== undefined) {
			const wlInfo = Command.getCommandInfo(info.to);
			if (wlInfo !== undefined) {
				const count = Command.getArgCount(wlInfo);
				if (count.defaultCount > token.children.length)
					return ExpectedChildrenResult.TOO_FEW;
			}
		}
	}
	return ExpectedChildrenResult.LOSELY_EQUAL;
}

function isCompleteSquareBracketExpression(token) {
	return isBalancedExpression(token, ParseTreeTokenType.SQUARE_RIGHT_BRACKET);
}

function isCompleteVectorExpression(token) {
	return isBalancedExpression(token, ParseTreeTokenType.ANGLE_RIGHT_BRACKET);
}

function isEndedWithEnd(token) {
	return isBalancedExpression(token, ParseTreeTokenType.END);
}

function isCompleteDictionary(token) {
	if (token.children.length === 0)
		return ExpectedChildrenResult.LOSELY_EQUAL;
	if (token.children.length > 1)
		return ExpectedChildrenResult.TOO_MANY;
	return ExpectedChildrenResult.RIGIDLY_EQUAL;
}

function isCompleteFunction(token) {
	if (token.children.length < 1)
		return ExpectedChildrenResult.TOO_FEW;
	if (token.children.length > 2)
		return ExpectedChildrenResult.TOO_MANY;
	const last = token.children[token.children.length - 1];
	if (last.type !== ParseTreeTokenType.CODE_BLOCK) {
		if (token.children.length < 2)
			return ExpectedChildrenResult.TOO_FEW;
	}
	return isCompleteInstructionList(last);
}

function isCompleteInstructionList(token) {
	return ExpectedChildrenResult.LOSELY_EQUAL;
}

function hasChildLength(exactLength) {
	return function(token) {
		if (token.children.length < exactLength)
			return ExpectedChildrenResult.TOO_FEW;
		else if (token.children.length > exactLength)
			return ExpectedChildrenResult.TOO_MANY;
		else
			return ExpectedChildrenResult.RIGIDLY_EQUAL;
	}
}

function isCompleteRange(token) {
	return isBalancedExpression(token, ParseTreeTokenType.INSTRUCTION_LIST);
}

const map = new Map([
	[ParseTreeTokenType.ARG_LIST, isCompleteArgList],
	[ParseTreeTokenType.ARRAY, isCompleteArray],
	[ParseTreeTokenType.BINARY_OPERATOR, hasChildLength(2)],
	[ParseTreeTokenType.BREAK, hasChildLength(0)],
	[ParseTreeTokenType.CASE, isCompleteCase],
	[ParseTreeTokenType.CODE_BLOCK, isCompleteCodeBlock],
	[ParseTreeTokenType.CONDITIONAL_TERNARY, hasChildLength(5)],
	[ParseTreeTokenType.CURLY_BRACKET_EXPRESSION, isCompleteCurlyBracketExpression],
	[ParseTreeTokenType.CURLY_LEFT_BRACKET, hasChildLength(0)],
	[ParseTreeTokenType.CURLY_RIGHT_BRACKET, hasChildLength(0)],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, isCompleteCurvedBracketExpression],
	[ParseTreeTokenType.CURVED_LEFT_BRACKET, hasChildLength(0)],
	[ParseTreeTokenType.CURVED_RIGHT_BRACKET, hasChildLength(0)],
	[ParseTreeTokenType.DECLARE, hasChildLength(1)],
	[ParseTreeTokenType.DICTIONARY, isCompleteDictionary],
	[ParseTreeTokenType.DOT, hasChildLength(0)],
	[ParseTreeTokenType.DOT_PROPERTY, hasChildLength(2)],
	[ParseTreeTokenType.ELSE, hasChildLength(1)],
	[ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, hasChildLength(3)],
	[ParseTreeTokenType.FUNCTION, isCompleteFunction],
	[ParseTreeTokenType.IF, isEndedWithEnd],
	[ParseTreeTokenType.IFDEF, isEndedWithEnd],
	[ParseTreeTokenType.IFNDEF, isEndedWithEnd],
	[ParseTreeTokenType.INCLUDE, hasChildLength(1)],
	[ParseTreeTokenType.INSTRUCTION_LIST, isCompleteInstructionList],
	[ParseTreeTokenType.KEY_VALUE_PAIR, hasChildLength(3)],
	[ParseTreeTokenType.LOCAL, hasChildLength(1)],
	[ParseTreeTokenType.MACRO, isEndedWithEnd],
	[ParseTreeTokenType.NUMBER_LITERAL, hasChildLength(0)],
	[ParseTreeTokenType.PARAMETERIZED_GROUP, isCompleteParameterizedGroup],
	[ParseTreeTokenType.RANGE, isCompleteRange],
	[ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION, isCompleteSquareBracketExpression],
	[ParseTreeTokenType.SEMICOLON, hasChildLength(0)],
	[ParseTreeTokenType.STRING_LITERAL, hasChildLength(0)],
	[ParseTreeTokenType.SWITCH, isEndedWithEnd],
	[ParseTreeTokenType.TREE_ROOT, isCompleteInstructionList],
	[ParseTreeTokenType.UNARY_OPERATOR, hasChildLength(1)],
	[ParseTreeTokenType.WHILE, isEndedWithEnd],
	[ParseTreeTokenType.VECTOR_EXPRESSION, isCompleteVectorExpression],
]);

export function hasAllExpectedChildren(token) {
	const func = map.get(token.type);
	if (func !== undefined)
		return func(token);
	return ExpectedChildrenResult.LOSELY_EQUAL;
};