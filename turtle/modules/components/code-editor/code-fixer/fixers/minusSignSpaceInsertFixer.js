import { Command } from
'../../../../parsing/Command.js';
import { DataTypes } from
'../../../../parsing/data-types/DataTypes.js';
import { insertColIndexSpanAt } from
'../../../../parsing/generic-parsing-utilities/insertColIndexSpanAt.js';
import { isInstructionList } from
'../../../../parsing/parse-tree-analysis/isInstructionList.js';
import { ParseTreeToken } from
'../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();
await DataTypes.asyncInit();

const invalidInstructionListChildTypes = new Set([
ParseTreeTokenType.BINARY_OPERATOR,
ParseTreeTokenType.BOOLEAN_LITERAL,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.STRING_LITERAL,
ParseTreeTokenType.UNARY_OPERATOR,
ParseTreeTokenType.VARIABLE_READ
]);
const invalidMinusFirstOperandTokenTypes = new Set([
ParseTreeTokenType.BOOLEAN_LITERAL,
ParseTreeTokenType.LEAF,
ParseTreeTokenType.LIST,
ParseTreeTokenType.PROCEDURE_END_KEYWORD,
ParseTreeTokenType.PROCEDURE_START_KEYWORD,
ParseTreeTokenType.STRING_LITERAL
]);
const numType = new DataTypes('num');

function canBePreviousOperandToken(token) {
	if (token === null || token.isBracket())
		return false;
	if (invalidMinusFirstOperandTokenTypes.has(token.type))
		return false;
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined) {
			if (info.returnTypes === null)
				return false;
			const returnTypes = Command.getReturnDataTypes(info);
			if (!returnTypes.hasIntersectionWith(numType))
				return false;
		}
	}
	return true;
}

function getPreviousValueToken(token) {
	if (token.previousSibling !== null && !token.previousSibling.isBracket()) {
		let tok = token.previousSibling;
		while (tok.children.length !== 0 && !canBePreviousOperandToken(tok))
			tok = tok.children[tok.children.length - 1];
		if (canBePreviousOperandToken(tok))
			return tok;
	}
	while (token.parentNode !== null &&
	token.previousSibling === null)
		token = token.parentNode;
	if (!canBePreviousOperandToken(token.previousSibling))
		return null;
	return token.previousSibling;
}

function isANextValueDirectChildOfInstructionList(token) {
	if (isInstructionList(token.parentNode))
		return true;
	while (token.parentNode !== null && !isInstructionList(token.parentNode))
		token = token.parentNode;
	if (token.parentNode === null)
		return false;
	const next = token.nextSibling;
	if (next === null || next.isBracket())
		return false;
	if (next.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
		if (next.children.length === 3) {
			const middle = next.children[1];
			if (middle.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
				return false;
			const info = Command.getCommandInfo(middle.val);
			if (info !== undefined) {
				if (info.isIndependentlyUseful)
					return false;
			}
			return true;
		}
		return false;
	}
	if (next.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(next.val);
		if (info !== undefined) {
			if (info.isIndependentlyUseful)
				return false;
		}
		else
			return false; // assume procedure call is good as a direct child of instruction list.
	}
	if (invalidInstructionListChildTypes.has(next.type))
		return true;
	return true;
}

function isOfInterest(token) {
	if (token.type === ParseTreeTokenType.NUMBER_LITERAL && token.val >= 0)
		return false;
	// Are there too many values to fit parameters of the parent?
	if (!isANextValueDirectChildOfInstructionList(token))
		return false;
	const prevValueToken = getPreviousValueToken(token);
	if (prevValueToken === null)
		return false;
	return true;
}

function makePositive(token) {
	token.val = Math.abs(token.val);
	if (token.originalString.startsWith('-')) {
		token.originalString = token.originalString.substring(1);
	}
}

function isNewChildNeeded(token) {
	if (isInstructionList(token.parentNode))
		return false;
	return true;
}

export function minusSignSpaceInsertFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByTypes(
		[ParseTreeTokenType.NUMBER_LITERAL, ParseTreeTokenType.UNARY_OPERATOR]).
		filter(isOfInterest);
	tokens.forEach(function(token) {
		const newChildNeeded = isNewChildNeeded(token);
		const prevValueToken = getPreviousValueToken(token);
		let minusOperator;
		if (token.type === ParseTreeTokenType.NUMBER_LITERAL) {
			makePositive(token);
			minusOperator = new ParseTreeToken('-', null, token.lineIndex, token.colIndex - 2,
				ParseTreeTokenType.BINARY_OPERATOR);
		}
		else {
			minusOperator = token;
			minusOperator.type = ParseTreeTokenType.BINARY_OPERATOR;
			cachedParseTree.tokenTypeChanged(minusOperator, ParseTreeTokenType.UNARY_OPERATOR);
			minusOperator.remove();
		}
		const parent = prevValueToken.parentNode;
		parent.replaceChild(prevValueToken, minusOperator);
		minusOperator.prependChild(prevValueToken);
		if (token !== minusOperator) {
			token.remove();
			minusOperator.appendChild(token);
			insertColIndexSpanAt(minusOperator, token.originalString.length + 1);
			cachedParseTree.tokenAdded(minusOperator);
		}
		else
			insertColIndexSpanAt(minusOperator, 2);
		if (newChildNeeded) {
			// FIXME: add a new child to parent.
			
		}
		fixLogger.log(`Added a space after minus sign so it would be treated as a binary operator.`, token);
	});
};