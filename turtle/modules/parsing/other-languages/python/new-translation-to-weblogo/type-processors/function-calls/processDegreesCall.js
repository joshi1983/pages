import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { isLikelyOnPackage } from './isLikelyOnPackage.js';
import { processToken } from '../processToken.js';

export function shouldProcessAsMathDegreesFunction(token, cachedParseTree) {
	const argList = token.children[0];
	const args = filterBracketsAndCommas(argList.children);
	if (args.length === 0)
		return false;

	return isLikelyOnPackage(token, cachedParseTree, 'math');
};

export function processDegreesCall(token, result, cachedParseTree, settings) {
	const argList = token.children[0];
	const parameterValueTokens = filterBracketsAndCommas(argList.children);
	if (shouldProcessAsMathDegreesFunction(token, cachedParseTree)) {
		result.append(' (( ');
		processToken(parameterValueTokens[0], result, cachedParseTree, settings);
		result.append(' ) * 180 / pi ) ');
		return;
	}
	result.processCommentsUpToToken(token);
	result.append('\npyDegrees ');
	if (parameterValueTokens.length === 0)
		result.append('360');
	else
		processToken(parameterValueTokens[0], result, cachedParseTree, settings);
	result.append('\n');
};