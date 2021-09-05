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

export function elementToToken(element, tree, isParentOfInterest) {
	if (isParentOfInterest === undefined)
		isParentOfInterest = isCommandOfInterest;
	else if (typeof isParentOfInterest !== 'function')
		throw new Error(`isParentOfInterest must be either undefined or a function but found: ${isParentOfInterest}`);
	const container = element.closest('.syntax-highlighter');
	let innerText = element.innerText;
	if (innerText[0] === '"')
		innerText = innerText.substring(1);
	const [lineNumber, colIndex] = getTextPositionFromElement(element, container);
	const tokens = getDescendentsOfTypes(tree, [ParseTreeTokenType.STRING_LITERAL, ParseTreeTokenType.LONG_STRING_LITERAL]).
		filter(t => t.lineIndex === lineNumber &&
			t.val.indexOf(innerText) !== -1 &&
			isParentOfInterest(t.parentNode));
	if (tokens.length === 1) {
		return tokens[0];
	}
};