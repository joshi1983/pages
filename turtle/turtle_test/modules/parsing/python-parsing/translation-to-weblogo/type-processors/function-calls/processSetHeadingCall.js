import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processToken } from '../../processToken.js';

const safeTypesWithoutBrackets = new Set([
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL
]);
function isBracketsNeeded(token) {
	return !safeTypesWithoutBrackets.has(token.type);
}

export function processSetHeadingCall(token, result, cachedParseTree) {
	result.processCommentsUpToToken(token);
	const parameterValueTokens = filterBracketsAndCommas(token.children);
	if (isBracketsNeeded(parameterValueTokens[0])) {
		result.append('\nsetHeading 90 - (');
			processToken(parameterValueTokens[0], result, cachedParseTree);
		result.append(')\n');
	}
	else {
		result.append('\nsetHeading 90 - ');
			processToken(parameterValueTokens[0], result, cachedParseTree);
		result.append('\n');
	}
};