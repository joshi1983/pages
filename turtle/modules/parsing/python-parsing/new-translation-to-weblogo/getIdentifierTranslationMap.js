import { getTokensByType } from
'../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

function mightBeVariableWorthTranslating(token) {
	return true;
}

export function getIdentifierTranslationMap(cachedParseTree) {
	// look for any identifiers that might translate to clashing identifiers in WebLogo.
	const result = new Map();
	const variableTokens = getTokensByType(cachedParseTree, ParseTreeTokenType.IDENTIFIER).
		filter(mightBeVariableWorthTranslating);
	const lowerNames = new Set();
	for (const variableToken of variableTokens) {
		const lowerName = variableToken.val.toLowerCase();
		if (!result.has(variableToken.val)) {
			if (lowerNames.has(lowerName)) {
				// need to translate this name to something else.
				for (let i = 1; true; i++) {
					const s = `${variableToken.val}${i}`;
					if (!result.has(s)) {
						result.set(variableToken.val, s);
						lowerNames.add(s.toLowerCase());
						break;
					}
				}
			}
			else {
				result.set(variableToken.val, variableToken.val);
				lowerNames.add(lowerName);
			}
		}
	}
	return result;
};