import { Command } from
'../../../../parsing/Command.js';
import { DataTypes } from
'../../../../parsing/data-types/DataTypes.js';
import { getNextArgToken } from
'./helpers/getNextArgToken.js';
import { getSortedFirstDescendentTokenOf } from
'../../../../parsing/generic-parsing-utilities/getSortedFirstDescendentTokenOf.js';
import { getSortedLastDescendentTokenOf } from
'../../../../parsing/generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { insertColIndexSpanAt } from
'../../../../parsing/generic-parsing-utilities/insertColIndexSpanAt.js';
import { NumberType } from
'../../../../parsing/data-types/NumberType.js';
import { ParseTreeToken } from
'../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../parsing/ParseTreeTokenType.js';
await DataTypes.asyncInit();

const numType = new NumberType();
const numTypes = new DataTypes(new Set([numType]));
const immediateReturnTokenTypes = new Set([
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.VARIABLE_READ
]);

function shouldReturn(token) {
	if (immediateReturnTokenTypes.has(token.type))
		return true;
	if (token.type !== ParseTreeTokenType.BINARY_OPERATOR &&
	token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return;
	if (isParameterizedGroupNum(token))
		return true;
	else if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP &&
	token.type !== ParseTreeTokenType.BINARY_OPERATOR &&
	numType.mayBeCompatibleWith(token))
		return true;
	return false;
}

function isParameterizedGroupNum(token) {
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(token.val);
		if (info === undefined) {
			return false; // we don't know if the procedure call is returning a number or not so return false.
		} else if (info.returnTypes === null)
			return false;
		const types = new DataTypes(info.returnTypes);
		return types.hasIntersectionWith(numTypes);
	}
	return false;
}

function getPreviousOperandToken(token) {
	let prev = token.previousSibling;
	while (prev !== null && prev !== undefined) {
		const srResult = shouldReturn(prev);
		if (srResult === true)
			return prev;
		else if (srResult === undefined)
			return;
		const children = prev.children;
		prev = children[children.length - 1];
	}
}

function getNextOperandToken(token) {
	let next = getNextArgToken(token);
	let bracketsNeeded = false;
	while(next !== null && next !== undefined) {
		const srResult = shouldReturn(next);
		if (srResult === true)
			return [next, bracketsNeeded];
		else if (srResult === undefined)
			return;

		if (next.type === ParseTreeTokenType.BINARY_OPERATOR)
			bracketsNeeded = true;

		const children = next.children;
		next = children[0];
	}
}

function getTopToMove(token) {
	let parent = token.parentNode;
	while (parent.type === ParseTreeTokenType.BINARY_OPERATOR) {
		token = parent;
		parent = token.parentNode;
	}
	return token;
}

function isOfInterest(token) {
	if (token.val !== '^')
		return false;
	// look for a left operand that might evaluate to a number.
	const prev = getPreviousOperandToken(token);
	if (prev === undefined)
		return false;

	// look for a right operand that might evaluate to a number.	
	return getNextOperandToken(token) !== undefined;
}

export function hatSymbolPowerFixer(cachedParseTree, fixLogger) {
	let tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).filter(isOfInterest);
	tokens.forEach(function(token) {
		const prev = getPreviousOperandToken(token);
		const [next, bracketsNeeded] = getNextOperandToken(token);
		const nextParent = next.parentNode;
		let prevFirstDescendent = getSortedFirstDescendentTokenOf(prev);
		if (prevFirstDescendent === undefined)
			prevFirstDescendent = prev;
		const insertGap = 6;
		insertColIndexSpanAt(prevFirstDescendent, insertGap);
		prevFirstDescendent.colIndex += insertGap;
		const prevParent = prev.parentNode;
		token.remove();
		token.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		token.val = 'power';
		prevParent.replaceChild(prev, token);
		prev.remove();
		next.remove();
		token.appendChild(prev);
		token.appendChild(next);
		const last = 
		cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.LEAF);
		token.lineIndex = prevFirstDescendent.lineIndex;
		token.colIndex = prevFirstDescendent.colIndex - insertGap + 1;
		if (bracketsNeeded) {
			const curvedBracketExpression = new ParseTreeToken(null, null, token.lineIndex, token.colIndex,
				ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
			const last = getSortedLastDescendentTokenOf(next);
			token.parentNode.replaceChild(token, curvedBracketExpression);
			const leftBracket = new ParseTreeToken('(', null, token.lineIndex, token.colIndex,
				ParseTreeTokenType.LEAF);
			const rightBracket = new ParseTreeToken(')', null, last.lineIndex, last.colIndex + 1,
				ParseTreeTokenType.LEAF);
			curvedBracketExpression.appendChild(leftBracket);
			curvedBracketExpression.appendChild(token);
			curvedBracketExpression.appendChild(rightBracket);
			cachedParseTree.tokensAdded([curvedBracketExpression, leftBracket, rightBracket]);
			if (nextParent.type === ParseTreeTokenType.BINARY_OPERATOR &&
			nextParent.children.length === 1) {
				const top = getTopToMove(prevParent);
				const topParent = top.parentNode;
				if (topParent !== null) {
					nextParent.remove();
					topParent.replaceChild(top, nextParent);
					top.remove();
					nextParent.prependChild(top);
				}
			}
		}
		fixLogger.log(`Replaced ^ with a call to the power command because WebLogo does not support ^ as an operator.  ^ is used by some other programming languages to indicate exponents, though.`, token);
	});
};