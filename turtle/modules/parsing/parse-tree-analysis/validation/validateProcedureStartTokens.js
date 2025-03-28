import { getTokensByType } from '../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function validateProcedureStartTokens(cachedParseTree, parseLogger) {
	const startTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.PROCEDURE_START_KEYWORD);
	startTokens.forEach(function(token) {
		if (token.parentNode !== null && token.parentNode.type !== ParseTreeTokenType.TREE_ROOT) {
			parseLogger.error('Check that all required inputs are specified for the previous command', token);
		}
	});
};