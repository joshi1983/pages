import { CommandCalls } from '../CommandCalls.js';
import { Keyword } from '../../Keyword.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { validateIdentifier } from '../validateIdentifier.js';

function validateVariableReadTokens(cachedParseTree, parseLogger) {
	cachedParseTree.getTokensByType(ParseTreeTokenType.VARIABLE_READ).
	forEach(function(varReadToken) {
		const validationMessage = validateIdentifier(varReadToken.val);
		if (validationMessage !== undefined)
			parseLogger.error('Invalid variable name.  A variable name ' + validationMessage, varReadToken);
	});
}

export function validateVariableNames(cachedParseTree, parseLogger) {
	const makeCalls = cachedParseTree.getCommandCallsByNames(['make', 'localmake']);
	makeCalls.forEach(function(makeCall) {
		const varNameToken = makeCall.children[0];
		if (varNameToken.type !== ParseTreeTokenType.STRING_LITERAL) {
			let extra = '';
			if (varNameToken.children.length === 0 && typeof varNameToken.val === 'string') {
				extra = ` For example, "${varNameToken.val}`;
			}
			parseLogger.error('Both make and localmake commands require the first input to start with a " quotation mark' + extra, varNameToken);
		}
		else {
			if (Keyword.getKeywordInfo(varNameToken.val) !== undefined)
				parseLogger.error('A variable name must not match a keyword', varNameToken);
			else {
				const validationMessage = validateIdentifier(varNameToken.val);
				if (validationMessage !== undefined)
					parseLogger.error('Invalid variable name.  A variable name ' + validationMessage, varNameToken);
			}
		}
	});
	validateVariableReadTokens(cachedParseTree, parseLogger);
};