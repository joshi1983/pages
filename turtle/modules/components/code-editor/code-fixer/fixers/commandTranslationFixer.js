import { Command } from '../../../../parsing/Command.js';
import { moveArgsForParameterizedGroup } from './helpers/moveArgsForParameterizedGroup.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

// fromVal is assumed to be case-insensitive.
const replacements = [
	{
		"fromVal": "pc",
		"nextSiblingType": ParseTreeTokenType.NUMBER_LITERAL,
		"toVal": "setPenColor",
		"reason": "pc gets the pen color but does not set it.  setPenColor sets the color to your number which is most-likely what you want."
	}
];

function processReplacement(token, replacementInfo, logger, cachedParseTree) {
	if (replacementInfo.toVal !== undefined) {
		logger.log(`Replaced ${token.val} with ${replacementInfo.toVal} because ${replacementInfo.reason}`, token);
		const previousValue = token.val;
		token.val = replacementInfo.toVal;
		let expectedArgCount = 0;
		if (replacementInfo.args !== undefined)
			expectedArgCount = replacementInfo.args.length;
		else {
			const info = Command.getCommandInfo(replacementInfo.toVal);
			if (info !== undefined) {
				expectedArgCount = info.args.length;
			}
		}
		moveArgsForParameterizedGroup(token, expectedArgCount);
		cachedParseTree.tokenValueChanged(token, previousValue);
	}
}

function isTokenMatchingReplacement(token, replacementInfo) {
	if (replacementInfo.fromType !== undefined && token.type !== replacementInfo.fromType)
		return false;
	if (replacementInfo.nextSiblingType !== undefined && 
	(token.nextSibling === null || token.nextSibling.type !== replacementInfo.nextSiblingType))
		return false;
	if (replacementInfo.fromVal !== undefined && token.val !== replacementInfo.fromVal) {
		if (typeof token.val !== typeof replacementInfo.fromVal)
			return false;
		if (typeof token.val === 'string') {
			if (token.val.toLowerCase() !== replacementInfo.fromVal)
				return false;
		}
		else
			return false;
	}
	return true;
}

/*
This can help people who paste code intended for:
https://www.transum.org/Software/Logo/

Several examples there use "pc" for what WebLogo does with "setPenColor".
*/
export function commandTranslationFixer(cachedParseTree, logger) {
	const tokens = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP);

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		for (let replacementIndex = 0; replacementIndex < replacements.length; replacementIndex++) {
			const replacementInfo = replacements[replacementIndex];
			if (isTokenMatchingReplacement(token, replacementInfo)) {
				processReplacement(token, replacementInfo, logger, cachedParseTree);
			}
		}
	}
};