import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { processToken } from '../processToken.js';

export function processDegreesCall(token, result, cachedParseTree) {
	result.processCommentsUpToToken(token);
	const argList = token.children[0];
	const parameterValueTokens = filterBracketsAndCommas(argList.children);
	result.append('\npyDegrees ');
	if (parameterValueTokens.length === 0)
		result.append('360');
	else
		processToken(parameterValueTokens[0], result, cachedParseTree);
	result.append('\n');
};