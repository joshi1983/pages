import { Command } from '../../../../parsing/Command.js';
import { getDescendentsOfTypes } from '../../../../parsing/generic-parsing-utilities/getDescendentsOfTypes.js';
import { getTextPositionFromElement } from '../../getTextPositionFromElement.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
await Command.asyncInit();
const convertableCommandNames = new Set(['image', 'imageAlpha']);

function isCommandOfInterest(token) {
	if (token === null || token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(token.val);
	if (info === undefined)
		return false;
	return convertableCommandNames.has(info.primaryName);
}

export function elementToToken(element, tree) {
	const container = element.closest('.syntax-highlighter');
	const innerText = element.innerText;
	const [lineNumber, colIndex] = getTextPositionFromElement(element, container);
	const tokens = getDescendentsOfTypes(tree, [ParseTreeTokenType.STRING_LITERAL, ParseTreeTokenType.LONG_STRING_LITERAL]).
		filter(t => t.lineIndex === lineNumber && t.val.indexOf(innerText) !== -1 &&
			isCommandOfInterest(t.parentNode));
	if (tokens.length === 1) {
		return tokens[0];
	}
};