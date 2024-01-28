import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { processToken } from '../../processToken.js';

export function processColorCall(token, result, cachedParseTree) {
	const parameterValueTokens = filterBracketsAndCommas(token.children);
	if (parameterValueTokens.length === 2) {
		result.processCommentsUpToToken(token);
		result.append('\nsetPenColor ');
		processToken(parameterValueTokens[0], result, cachedParseTree);
		result.append('\nsetFillColor ');
		processToken(parameterValueTokens[1], result, cachedParseTree);
	}
	else
		return false; // indicate not processed.
};