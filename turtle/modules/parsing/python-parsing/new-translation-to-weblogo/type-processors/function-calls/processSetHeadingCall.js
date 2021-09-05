import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';

const safeTypesWithoutBrackets = new Set([
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.NUMBER_LITERAL
]);
function isBracketsNeeded(token) {
	return !safeTypesWithoutBrackets.has(token.type);
}

export function processSetHeadingCall(token, result, cachedParseTree, settings) {
	result.processCommentsUpToToken(token);
	const argList = token.children[0];
	const parameterValueTokens = filterBracketsAndCommas(argList.children);
	if (isBracketsNeeded(parameterValueTokens[0])) {
		result.append('\nsetHeading 90 - (');
			processToken(parameterValueTokens[0], result, cachedParseTree, settings);
		result.append(')\n');
	}
	else {
		result.append('\nsetHeading 90 - ');
			processToken(parameterValueTokens[0], result, cachedParseTree, settings);
		result.append('\n');
	}
};