import { Colour } from '../../../../Colour.js';
import { Command } from '../../../../parsing/Command.js';
import { DataTypes } from '../../../../parsing/data-types/DataTypes.js';
import { getAllDescendentsAsArray } from '../../../../parsing/generic-parsing-utilities/getAllDescendentsAsArray.js';
import { isAfterOrSame } from '../../../../parsing/generic-parsing-utilities/isAfterOrSame.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
await Colour.asyncInit();
await Command.asyncInit();
await ParseTreeToken.asyncInit();

const colorType = new DataTypes('color');
const commandNamesReturningColour = new Set(Command.getAllCommandsInfo().filter(function(info) {
	if (info.returnTypes === null)
		return false;
	const types = new DataTypes(info.returnTypes);
	return types.hasIntersectionWith(colorType);
}).map(info => info.primaryName));

function canBeSanitizedForColour(token) {
	if (token === null)
		return false;
	if (ParseTreeTokenType.PARAMETERIZED_GROUP === token.type) {
		const info = Command.getCommandInfo(token.val);
		if (info !== undefined) {
			return commandNamesReturningColour.has(info.primaryName);
		}
		return true; // a procedure might return a color.
	}
	if (ParseTreeTokenType.NUMBER_LITERAL !== token.type && !token.isStringLiteral())
		return false;
	let val = token.val;
	if (token.isStringLiteral() && !isNaN(val) && val.indexOf('.') === -1)
		val = parseInt(val);
	if (Colour.canBeInterprettedAsColour(val))
		return true;
	return false;
}

function getInstructionTokens(instructionTokens) {
	const result = [];
	for (let i = 0; i < instructionTokens.length; i++) {
		const token = instructionTokens[i];
		if ((i !== 0 || !token.isBracket()) && (i !== instructionTokens.length - 1 || !token.isBracket())) {
			result.push(token);
		}
	}
	return result;
}

function getLastDescendentToken(token) {
	let result = token;
	const descendentTokens = getAllDescendentsAsArray(token);
	descendentTokens.forEach(function(tok) {
		if (isAfterOrSame(tok, result))
			result = tok;
	});
	return result;
}

export function filledFixer(cachedParseTree, fixLogger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(tok => tok.val.toLowerCase() === 'filled' &&
			canBeSanitizedForColour(tok.nextSibling) &&
			tok.nextSibling.nextSibling !== null &&
			tok.nextSibling.nextSibling.type === ParseTreeTokenType.LIST &&
			tok.nextSibling.nextSibling.children.length > 2
		);
	tokens.forEach(function(filledToken) {
		const parentNode = filledToken.parentNode;
		const previousSibling = filledToken.previousSibling;
		const colorToken = filledToken.nextSibling;
		const wrappedInstructionListToken = filledToken.nextSibling.nextSibling;
		const lastBracketToken = wrappedInstructionListToken.children[wrappedInstructionListToken.children.length - 1];
		const firstBracketToken = wrappedInstructionListToken.children[0];
		const wrappedInstructions = getInstructionTokens(wrappedInstructionListToken.children);
		filledToken.remove();
		colorToken.remove();
		wrappedInstructionListToken.remove();
		const setFillColor = new ParseTreeToken('setFillColor', null,
			colorToken.lineIndex, colorToken.colIndex - 1, ParseTreeTokenType.PARAMETERIZED_GROUP);
		if (previousSibling !== null)
			previousSibling.appendSibling(setFillColor);
		else if (parentNode.children.length !== 0) {
			const nextSibling = parentNode.children[0];
			nextSibling.appendPreviousSibling(setFillColor);
		}
		else {
			parentNode.appendChild(setFillColor);
		}

		setFillColor.appendChild(colorToken);
		filledToken.val = 'polyStart';
		filledToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		const lastColorToken = getLastDescendentToken(colorToken);
		filledToken.colIndex = lastColorToken.colIndex + 1;
		filledToken.lineIndex = lastColorToken.lineIndex;
		setFillColor.appendSibling(filledToken);

		// sanitize the type.
		if (colorToken.isStringLiteral() && !isNaN(colorToken.val)) {
			const oldType = colorToken.type;
			colorToken.type = ParseTreeTokenType.NUMBER_LITERAL;
			colorToken.originalString = colorToken.val;
			colorToken.val = parseFloat(colorToken.val);
			cachedParseTree.tokenTypeChanged(colorToken, oldType);
		}
		let lastToken = filledToken;
		for (let i = 0; i < wrappedInstructions.length; i++) {
			const instructionToken = wrappedInstructions[i];
			lastToken.appendSibling(instructionToken);
			lastToken = instructionToken;
		}
		const polyEnd = new ParseTreeToken('polyEnd', null,
			lastBracketToken.lineIndex, lastBracketToken.colIndex, ParseTreeTokenType.PARAMETERIZED_GROUP);
		lastToken.appendSibling(polyEnd);

		// notify the cache what changes happened so it efficiently updates.
		cachedParseTree.tokenTypeChanged(filledToken, ParseTreeTokenType.LEAF);
		cachedParseTree.tokenValueChanged(filledToken, 'filled');
		cachedParseTree.tokensAdded([setFillColor, polyEnd]);
		cachedParseTree.tokenRemoved(lastBracketToken);
		cachedParseTree.tokenRemoved(firstBracketToken);
		cachedParseTree.tokenRemoved(wrappedInstructionListToken);

		fixLogger.log('Replaced call to "filled" with setFillColor, polyStart, and polyEnd.', filledToken);
	});
};
