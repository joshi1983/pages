import { Command } from '../../../../parsing/Command.js';
import { isParameterTokenRequiredToBeColour } from './helpers/isParameterTokenRequiredToBeColour.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

/*
Very similar to quoteNumberFixer but focuses on other tokens such as colours.
*/

function isToBeChanged(t) {
	if (isNaN(t.val) || t.val === '' || t.val.indexOf('.') !== -1 || t.parentNode === null)
		return false;
	return isParameterTokenRequiredToBeColour(t);
}

export function quoteIntegerFixer(cachedParseTree, fixLogger) {
	const tokensToChange = cachedParseTree.getTokensByType(ParseTreeTokenType.STRING_LITERAL).
		filter(isToBeChanged);
	tokensToChange.forEach(function(stringToken) {
		const oldValue = stringToken.val;
		stringToken.val = parseInt(oldValue);
		stringToken.originalString = oldValue;
		stringToken.type = ParseTreeTokenType.NUMBER_LITERAL;
		cachedParseTree.tokenTypeChanged(stringToken, ParseTreeTokenType.STRING_LITERAL);
		cachedParseTree.tokenValueChanged(stringToken, oldValue);
		fixLogger.log(`Quote removed before integer value ${stringToken.val} because integer values are not to be prefixed with a quote.  A quote indicates a string.`, stringToken);
	});
};