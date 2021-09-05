import { getTokensByType } from '../cached-parse-tree/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function hasTrailingQuote(token) {
	return token.val.length > 1 &&
		token.val.endsWith('"');
}

function isOfInterest(token) {
	// should token not be immediately before a string literal?
	// for a leaf or list, we don't mind.  For example, for ["x 1 3 1] [...
	if (token.type === ParseTreeTokenType.LEAF || token.type === ParseTreeTokenType.LIST)
		return false;
	// We don't mind for a curved bracket expression either.
	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		return false;

	return true;
}

function getLocationKey(colIndex, lineIndex) {
	return colIndex + '-' + lineIndex;
}

function validateForTips(cachedParseTree, parseLogger) {
	const tokenLocations = new Set();
	cachedParseTree.getAllTokens().forEach(function(token) {
		if (isOfInterest(token))
			tokenLocations.add(getLocationKey(token.colIndex, token.lineIndex));
	});
	const stringLiteralsMissingSpaces = getTokensByType(cachedParseTree, ParseTreeTokenType.STRING_LITERAL).
	filter(function(token) {
		return tokenLocations.has(getLocationKey(token.colIndex - token.val.length - 1, token.lineIndex));
	});
	stringLiteralsMissingSpaces.forEach(function(token) {
		parseLogger.tip('Add a space before your " to make your code more readable.', token, false);
	});
}

function validateTrailingQuotes(cachedParseTree, parseLogger) {
	const tokens = getTokensByType(cachedParseTree, ParseTreeTokenType.STRING_LITERAL).filter(hasTrailingQuote);
	tokens.forEach(function(token) {
		parseLogger.error(`Regular string literals should start but not end with a ".  Consider replacing "${token.val} with "${token.val.substring(0, token.val.length - 1)}.  If you want to include a " in your string value, use apostrophes instead to form a long string literal such as '${token.val}'.`, token, false);
	});
}

export function validateQuotes(cachedParseTree, parseLogger) {
	validateForTips(cachedParseTree, parseLogger);
	validateTrailingQuotes(cachedParseTree, parseLogger);
};