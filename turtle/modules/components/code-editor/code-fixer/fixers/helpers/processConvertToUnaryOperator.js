import { Command } from '../../../../../parsing/Command.js';
import { getSortedNextTokenAfter } from '../../../../../parsing/generic-parsing-utilities/getSortedNextTokenAfter.js';
import { Operators } from '../../../../../parsing/Operators.js';
import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';
import { SetUtils } from '../../../../../SetUtils.js';
await Operators.asyncInit();

const unaryChildTokenTypes = new Set([
ParseTreeTokenType.BINARY_OPERATOR,
ParseTreeTokenType.BOOLEAN_LITERAL,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.PARAMETERIZED_GROUP,
ParseTreeTokenType.STRING_LITERAL,
ParseTreeTokenType.UNARY_OPERATOR,
ParseTreeTokenType.VARIABLE_READ,
]);

function getUnaryOperatorChild(unaryToken) {
	if (unaryToken.children.length !== 0)
		return unaryToken.children[0];
	while (unaryToken.parentNode !== null) {
		const next = unaryToken.nextSibling;
		if (next !== null) {
			if (unaryChildTokenTypes.has(next.type))
				return next;
			else
				return null;
		}
		unaryToken = unaryToken.parentNode;
	}
}

function isTokenOfInterest(commandNamesOfInterest) {
	return function(token) {
		if (!commandNamesOfInterest.has(token.val.toLowerCase()))
			return false;
		const next = getUnaryOperatorChild(token);
		if (next === null && token.children.length === 0)
			return false;
		return true;
	};
}

function isCommandOfInterest(commandInfo) {
	return commandInfo.convertToUnaryOperator !== undefined;
}

function canMoveCloser(tokenToMove, next) {
	if (next.colIndex === 0)
		return false;
	return true;
}

export function processConvertToUnaryOperator(cachedParseTree, fixLogger, info) {
	const commandsOfInterest = info.commands.filter(isCommandOfInterest);
	if (commandsOfInterest.length === 0)
		return; // save a little processing time when we know nothing will be fixed.
		// Most migrations have no convertToUnaryOperator settings so this will return frequently.

	const commandNamesOfInterest = new Set();
	const commandsOfInterestMap = new Map();
	commandsOfInterest.forEach(function(commandInfo) {
		const lowerCaseNames = Command.getLowerCaseCommandNameSet(commandInfo);
		SetUtils.addAll(commandNamesOfInterest, lowerCaseNames);
		for (const name of lowerCaseNames) {
			commandsOfInterestMap.set(name, commandInfo);
		}
	});
	const tokensOfInterest = cachedParseTree.getTokensByTypes(
		[ParseTreeTokenType.LEAF, ParseTreeTokenType.PARAMETERIZED_GROUP]).
	filter(isTokenOfInterest(commandNamesOfInterest));
	tokensOfInterest.forEach(function(tokenToChange) {
		if (tokenToChange.children.length === 0) {
			// Make sure the unary operator will have a child token.
			const next = getUnaryOperatorChild(tokenToChange);
			if (next === null)
				return;

			// Checking if next is null just being extra cautious.
			// We got a non-null next token before when finding tokens of interest.
			// Some previous fixes could have changed the tree in ways that prevent 
			// subsequent fixes from finding suitable unary operator child tokens, though.
			next.remove();
			tokenToChange.appendChild(next);
		}
		// FIXME: if tokenToChange.children.length > 1, move the extra children to better parents.
		const oldVal = tokenToChange.val;
		const oldType = tokenToChange.type;
		const commandInfo = commandsOfInterestMap.get(tokenToChange.val.toLowerCase());
		tokenToChange.val = commandInfo.convertToUnaryOperator;
		tokenToChange.type = ParseTreeTokenType.UNARY_OPERATOR;
		if (oldType !== tokenToChange.type)
			cachedParseTree.tokenTypeChanged(tokenToChange, oldType);
		const operatorInfo = Operators.getOperatorInfo(tokenToChange.val);
		if (Operators.canBeBinary(operatorInfo)) {
			const next = getSortedNextTokenAfter(tokenToChange);
			if (canMoveCloser(tokenToChange, next)) {
				tokenToChange.colIndex = next.colIndex - 1;
				tokenToChange.lineIndex = next.lineIndex;
			}
		}
		fixLogger.log(`Replaced ${oldVal} with ${tokenToChange.val} because WebLogo uses a unary operator instead of a command for this.`, tokenToChange);
	});
}