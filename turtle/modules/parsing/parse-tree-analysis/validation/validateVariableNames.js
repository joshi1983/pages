import { Colour } from '../../../Colour.js';
import { getTokensByType } from '../../generic-parsing-utilities/getTokensByType.js';
import { Keyword } from '../../Keyword.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { validateIdentifier } from '../validateIdentifier.js';
await Colour.asyncInit();

function validateVariableReadTokens(cachedParseTree, parseLogger) {
	getTokensByType(cachedParseTree, ParseTreeTokenType.VARIABLE_READ).
	forEach(function(varReadToken) {
		const validationMessage = validateIdentifier(varReadToken.val);
		if (validationMessage !== undefined) {
			parseLogger.error(`Invalid variable name(${varReadToken.val}).  A variable name ` + validationMessage, varReadToken);
		}
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
				if (varNameToken.type === ParseTreeTokenType.LONG_STRING_LITERAL)
					extra = '  Long strings are suitable for URL\'s and text containing spaces but they\'re not acceptable for variable name references.';
			}
			parseLogger.error('Both make and localmake commands require the first input to start with a " quotation mark' + extra, varNameToken);
		}
		else {
			if (Keyword.getKeywordInfo(varNameToken.val) !== undefined)
				parseLogger.error('A variable name must not match a keyword', varNameToken);
			else if (Colour.getColourInfoByName(varNameToken.val) !== undefined)
				parseLogger.warn(`${varNameToken.val} matches the name of a color.  Consider something else like "${varNameToken.val}Color to avoid confusing people who read your code.`, varNameToken);
			else {
				const validationMessage = validateIdentifier(varNameToken.val);
				if (validationMessage !== undefined)
					parseLogger.error(`Invalid variable name(${varNameToken.val}).  A variable name ` + validationMessage, varNameToken);
			}
		}
	});
	validateVariableReadTokens(cachedParseTree, parseLogger);
};