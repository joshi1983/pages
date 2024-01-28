import { AlphaColour } from '../../../../AlphaColour.js';
import { Colour } from '../../../../Colour.js';
import { Command } from '../../../../parsing/Command.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { Procedure } from '../../../../parsing/Procedure.js';
import { sanitizeColourString } from './helpers/sanitizeColourString.js';
await Colour.asyncInit();
await Command.asyncInit();
await ParseTreeToken.asyncInit();
const colorKeys = new Set();
function getKey(primaryName, index) {
	return primaryName + '-' + index;
}
Command.getAllCommandsInfo().forEach(function(info) {
	const args = info.args;
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg.types === 'color' || arg.types === 'color|transparent' ||
		arg.types === 'alphacolor' || arg.types === 'alphacolor|transparent') {
			colorKeys.add(getKey(info.primaryName, i));
		}
	}
});
function isColorParameter(primaryName, childIndex) {
	return colorKeys.has(getKey(primaryName, childIndex));
}

function sanitizeColourStrings(cachedParseTree, fixLogger) {
	const colourTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.STRING_LITERAL).filter(function(token) {
		const parent = token.parentNode;
		if (parent.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return false;
		const info = Command.getCommandInfo(parent.val);
		if (info === undefined)
			return false;
		const childIndex = parent.children.indexOf(token);
		if (!isColorParameter(info.primaryName, childIndex))
			return false;
		return !Colour.canBeInterprettedAsColour(token.val) &&
			!AlphaColour.canBeInterprettedAsAlphaColour(token.val);
	});
	colourTokens.forEach(function(token) {
		const newVal = sanitizeColourString(token.val);
		if (newVal !== token.val) {
			const oldValue = token.val;
			token.val = newVal;
			cachedParseTree.tokenValueChanged(token, oldValue);
			fixLogger.log(`Replaced invalid color string ${oldValue} with ${newVal}`, token);
		}
	});
}

export function colourStringLiteralFixer(cachedParseTree, fixLogger) {
	sanitizeColourStrings(cachedParseTree, fixLogger);
	const colourTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).filter(function(token) {
		if (Procedure.isNameToken(token)) // Don't replace procedure names.
			return false;
		return Colour.canBeInterprettedAsColour(token.val);
	});
	colourTokens.forEach(function(token) {
		token.type = ParseTreeTokenType.STRING_LITERAL;
		cachedParseTree.tokenTypeChanged(token, ParseTreeTokenType.LEAF);
		fixLogger.log(`Added quote to beginning of ${token.val} because color strings must start with a quote`, token);
	});
};