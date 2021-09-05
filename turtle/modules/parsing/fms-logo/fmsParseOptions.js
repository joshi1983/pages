import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

/*
Since FMSLogo doesn't require quotation marks for values in its data lists,
words like "end" and "to" can be problematic for the WebLogo parser but not for FMSLogo's parser.

For example, print [hello to the end of the world] is valid FMSLogo code.
print 'hello to the end of the world' is how that would be written in WebLogo.

The following function is injected into LogoParser.getParseTree to help it treat the 
end and to tokens as leafs instead of markers for the start and end of a procedure.
*/
function mightBeInDataList(token) {
	if (token === undefined || token === null)
		return false;
	token = token.parentNode;
	while (token !== null) {
		if (token.type === ParseTreeTokenType.LIST) {
			const first = token.children[0];
			if (first.isBracket() && first.val === '[')
				return true;
		}
		token = token.parentNode;
	}
	return false;
}

function scanTokenToParseTreeTokenType(newToken, previousToken) {
	if (newToken.type === ParseTreeTokenType.PROCEDURE_END_KEYWORD ||
	newToken.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD) {
		if (mightBeInDataList(previousToken))
			return ParseTreeTokenType.LEAF;
	}
	return newToken.type; // no change
}

export const fmsParseOptions = {
		'isSplittingNumberPrefixes': true,
		'supressGroupingErrors': true,
		'scanTokenToParseTreeTokenType': scanTokenToParseTreeTokenType
	};