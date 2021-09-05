import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function validateQuotes(cachedParseTree, parseLogger) {
	const tokenLocations = new Set();
	function getLocationKey(colIndex, lineIndex) {
		return colIndex + '-' + lineIndex;
	}
	cachedParseTree.getAllTokens().filter(function(token) {
		// should token not be immediately before a string literal?
		// for a leaf or list, we don't mind.  For example, for ["x 1 3 1] [...
		if (token.type === ParseTreeTokenType.LEAF || token.type === ParseTreeTokenType.LIST)
			return false;
		// We don't mind for a curved bracket expression either.
		if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
			return false;

		return true;
	}).forEach(function(token) {
		tokenLocations.add(getLocationKey(token.colIndex, token.lineIndex));
	});
	const stringLiteralsMissingSpaces = cachedParseTree.getTokensByType(ParseTreeTokenType.STRING_LITERAL).
	filter(function(token) {
		return tokenLocations.has(getLocationKey(token.colIndex - token.val.length - 1, token.lineIndex));
	});
	stringLiteralsMissingSpaces.forEach(function(token) {
		parseLogger.tip('Add a space before your " to make your code more readable.', token, false);
	});
};