import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { isLikelyOnPackage } from './isLikelyOnPackage.js';
import { processToken } from '../processToken.js';

export function shouldProcessAsMathRadiansFunction(token, cachedParseTree) {
	const argList = token.children[0];
	const args = filterBracketsAndCommas(argList.children);
	if (args.length === 0)
		return false;

	return isLikelyOnPackage(token, cachedParseTree, 'math');
};

export function processRadiansCall(token, result, cachedParseTree, settings) {
	const argList = token.children[0];
	const parameterValueTokens = filterBracketsAndCommas(argList.children);
	if (shouldProcessAsMathRadiansFunction(token, cachedParseTree)) {
		result.append(' (( ');
		processToken(parameterValueTokens[0], result, cachedParseTree, settings);
		result.append(' ) * pi / 180 ) ');
		return;
	}
	result.processCommentsUpToToken(token);
	result.append(`\npyDegrees 2 * pi\n`);
};