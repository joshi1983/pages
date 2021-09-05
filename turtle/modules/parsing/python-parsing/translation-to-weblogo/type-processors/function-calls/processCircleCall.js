import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { processToken } from '../../processToken.js';
import { shouldBeTranslatedToPyCircle } from '../../../parse-tree-analysis/procedure-dependencies/shouldBeTranslatedToPyCircle.js';

function handleWithPyCircle(token, result, cachedParseTree) {
	const parameterValueTokens = filterBracketsAndCommas(token.children);
	result.append('\npyCircle ');
	if (parameterValueTokens.length === 1) {
		processToken(parameterValueTokens[0], result, cachedParseTree);
		result.append(' 360');
	}
	else if (parameterValueTokens.length >= 2) {
		processToken(parameterValueTokens[0], result, cachedParseTree);
		result.append(' ');
		processToken(parameterValueTokens[1], result, cachedParseTree);
	}
	// If steps is specified, ignore it.
	// We don't care how many polygon sides are given.
	//  We'll translate as if it were infinity.
	result.append('\n');
}

export function processCircleCall(token, result, cachedParseTree) {
	result.processCommentsUpToToken(token);
	if (shouldBeTranslatedToPyCircle(cachedParseTree, token)) {
		handleWithPyCircle(token, result, cachedParseTree);
		return;
	}
	const parameterValueTokens = filterBracketsAndCommas(token.children);
	if (parameterValueTokens.length === 1) {
		result.append('\ncircleLeft ');
		processToken(parameterValueTokens[0], result, cachedParseTree);
	}
	else
		return false; // indicate not processed.
};