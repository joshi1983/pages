import { countArgValueTokens } from './countArgValueTokens.js';
import { functionDefinitionTypes } from './functionDefinitionTypes.js';
import { isCompleteDataTypeToken } from './isCompleteDataTypeToken.js';
import { isCompleteDoToken } from './isCompleteDoToken.js';
import { isCompleteForToken } from './isCompleteForToken.js';
import { isDefAssignment } from './isDefAssignment.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { QBasicInternalFunctions } from '../QBasicInternalFunctions.js';

const argListIncompleteLastChildTypes = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.SEMICOLON
]);

const parentTypesIndicatingNoChildren = new Set([
	ParseTreeTokenType.END_DEF,
	ParseTreeTokenType.END_FOR,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.END_SELECT,
	ParseTreeTokenType.END_SUB
]);

const noChildTypes = new Set([
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.EACH,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.LABEL,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.SEMICOLON,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.THEN,
	ParseTreeTokenType.UNMATCHED,
	ParseTreeTokenType.WEND
]);
const oneChildTypes = new Set([
	ParseTreeTokenType.DECLARE,
	ParseTreeTokenType.EXIT,
	ParseTreeTokenType.GOSUB,
	ParseTreeTokenType.NEXT,
	ParseTreeTokenType.UNARY_OPERATOR
]);
const twoChildTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.END_DEF,
	ParseTreeTokenType.END_FUNCTION,
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.END_SUB,
	ParseTreeTokenType.END_TYPE,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IN,
	ParseTreeTokenType.LOOP_UNTIL,
	ParseTreeTokenType.LOOP_WHILE,
	ParseTreeTokenType.ON
]);
const threeChildTypes = new Set([
	ParseTreeTokenType.EXPRESSION_DOT
]);

/*
These are statements that use commas and semicolons for formatting or other special purposes.
*/
const statementsWithUnlimitedArgTokens = new Set([
	'input', 'line input', 'print'
]);

function isSpecialOpenStatementToken(token) {
	if (token.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	const parent = token.parentNode;
	if (parent === null ||
	parent.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	if (parent.children.length > 4)
		return false;
	const nameToken = parent.children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	return nameToken.val.toLowerCase() === 'open';
}

function isCurvedBracketBalanced(token) {
	const children = token.children;
	const firstChild = children[0];
	if (firstChild === undefined)
		return true;
	const lastChild = children[children.length - 1];
	if (firstChild.type === ParseTreeTokenType.CURVED_LEFT_BRACKET)
		return lastChild.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET;
	if (token.type === ParseTreeTokenType.ARG_LIST) {
		return !argListIncompleteLastChildTypes.has(lastChild.type);
	}
	return true;
}

function isReturnComplete(token) {
	if (token.children.length >= 1)
		return true;
	return false;
}

export function isComplete(token, functionsMap) {
	if (isSpecialOpenStatementToken(token))
		return false;
	if (noChildTypes.has(token.type))
		return true;
	if (token.type === ParseTreeTokenType.DO)
		return isCompleteDoToken(token);

	const children = token.children;
	const lastChild = children[children.length - 1];
	if (lastChild !== undefined &&
	(lastChild.type === ParseTreeTokenType.COMMA ||
	lastChild.type === ParseTreeTokenType.SEMICOLON))
		return false;
	if (oneChildTypes.has(token.type))
		return children.length >= 1;
	if (twoChildTypes.has(token.type))
		return children.length >= 2;
	if (threeChildTypes.has(token.type))
		return children.length >= 3;
	if (token.type === ParseTreeTokenType.AS) {
		if (token.children.length >= 1)
			return true;
	}
	if (token.type === ParseTreeTokenType.CONST) {
		if (children.length === 0)
			return false;
		if (lastChild.children.length < 2 ||
		lastChild.val !== '=')
			return false;
		return true;
	}
	else if (token.type === ParseTreeTokenType.DATA_TYPE)
		return isCompleteDataTypeToken(token);
	else if (token.type === ParseTreeTokenType.DEF) {
		if (isDefAssignment(token))
			return true;
		if (token.children.length >= 4)
			return true;
	}
	if (token.type === ParseTreeTokenType.DIM ||
	token.type === ParseTreeTokenType.REDIM) {
		if (lastChild !== undefined && lastChild.type === ParseTreeTokenType.AS)
			return true;
	}
	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	children.length >= 2)
		return lastChild.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET;
	if (lastChild !== undefined &&
	lastChild.type === ParseTreeTokenType.IDENTIFIER &&
	lastChild.val.toLowerCase() === 'for')
		return false;
	if (token.type === ParseTreeTokenType.RETURN)
		return isReturnComplete(token);
	const prev = token.getPreviousSibling();
	const parent = token.parentNode;
	if (parent !== null && parentTypesIndicatingNoChildren.has(parent.type))
		return true;
	if (token.type === ParseTreeTokenType.ARG_LIST) {
		if (prev !== null && prev.val !== null &&
		prev.type === ParseTreeTokenType.IDENTIFIER &&
		parent.type === ParseTreeTokenType.FUNCTION_CALL) {
			const info = QBasicInternalFunctions.getFunctionInfo(prev.val.toLowerCase(), functionsMap);
			if (info !== undefined) {
				const argCount = info.argCount;
				if (argCount === undefined) {
					if (info.args !== undefined) {
						const currentValueCount = countArgValueTokens(token);
						if (currentValueCount >= info.args.length)
							return isCurvedBracketBalanced(token);
					}
				}
				else {
					if (argCount.min !== undefined &&
					argCount.min > countArgValueTokens(token))
						return false;
				}
				if (info.isStatement === true &&
				!statementsWithUnlimitedArgTokens.has(info.primaryName))
					return false;
			}
			else
				return false; // we don't really know if it is complete but false is
					// a better result than true.
		}
		if (children.length > 1)
			return lastChild.val === ')' && isCurvedBracketBalanced(token);
	}
	if (token.type === ParseTreeTokenType.FOR) {
		return isCompleteForToken(token);
	}

	if (token.type === ParseTreeTokenType.TUPLE_LITERAL)
		return lastChild.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET;
	if (token.type === ParseTreeTokenType.IF &&
	children.length < 2)
		return false;
	if (functionDefinitionTypes.has(token.type) &&
	children.length < 2)
		return false;
	if (token.type === ParseTreeTokenType.WHILE)
		return children.length >= 3;

	if (parent !== null && parent.type === ParseTreeTokenType.DECLARE) {
		return true;
	}
	return false;
};