import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { processColorValueToken } from '../processColorValueToken.js';

export function processColorCall(token, result, cachedParseTree) {
	const argList = token.children[0];
	const parameterValueTokens = filterBracketsAndCommas(argList.children);
	if (parameterValueTokens.length === 2) {
		result.processCommentsUpToToken(token);
		result.append('\nsetPenColor ');
		processColorValueToken(parameterValueTokens[0], result, cachedParseTree);
		result.append('\nsetFillColor ');
		processColorValueToken(parameterValueTokens[1], result, cachedParseTree);
		result.append('\n');
	}
	else
		return false; // indicate not processed.
};