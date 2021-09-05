import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function validateLongStrings(cachedParseTree, parseLogger) {
	const longStrings = cachedParseTree.getTokensByType(ParseTreeTokenType.LONG_STRING_LITERAL).filter(t => t.isComplete === false);
	longStrings.forEach(function(token) {
		parseLogger.error('You should close the long string literal with an apostrophe(\').', token, false);
	});
};