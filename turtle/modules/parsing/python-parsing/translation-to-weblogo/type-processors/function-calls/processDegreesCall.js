import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { processToken } from '../../processToken.js';

export function processDegreesCall(token, result, cachedParseTree) {
	result.processCommentsUpToToken(token);
	const parameterValueTokens = filterBracketsAndCommas(token.children);
	result.append('\npyDegrees ');
	if (parameterValueTokens.length === 0)
		result.append('360');
	else
		processToken(parameterValueTokens[0], result, cachedParseTree);
	result.append('\n');
};