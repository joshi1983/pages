import { getTokensByType } from '../cached-parse-tree/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function validateLongStrings(cachedParseTree, parseLogger) {
	const longStrings = getTokensByType(cachedParseTree, ParseTreeTokenType.LONG_STRING_LITERAL).filter(t => t.isComplete === false);
	longStrings.forEach(function(token) {
		let exampleText = '';
		if (token.val.length < 50) {
			// We want to show the example only if it is reasonably short.
			// If it has many lines, it won't show the ending apostrophe 
			// very well and will push the user to scroll.
			exampleText = `.  For example, ${token.toString()}'`;
		}
		parseLogger.error(`You should close the long string literal with an apostrophe(\')${exampleText}`, token, false);
	});
};