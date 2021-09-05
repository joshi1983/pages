import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function validateKeywords(cachedParseTree, parseLogger) {
	cachedParseTree.getTokensByTypes([
		ParseTreeTokenType.PROCEDURE_END_KEYWORD,
		ParseTreeTokenType.PROCEDURE_START_KEYWORD
	]).forEach(function(token) {
		// name, paramList, instructionList, end
		if (token.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD) {
			if (token.children.length < 4) {
				let msg = 'The procedure definition is incomplete. ';
				if (token.children.length === 0)
					msg += 'name, parameters, instructions and an "end" are required';
				else if (token.children.length === 1)
					msg += 'parameters, instructions and an "end" are required';
				else if (token.children.length === 2)
					msg += 'instructions and an "end" are required';
				else
					msg += 'an "end" is required';
				parseLogger.error(msg, token);
			}
		}
		else {
			if (token.parentNode.type !== ParseTreeTokenType.PROCEDURE_START_KEYWORD) {
				parseLogger.error('The "end" keyword must be used within a procedure to mark the end of its instruction list', token);
			}
		}
	});
}