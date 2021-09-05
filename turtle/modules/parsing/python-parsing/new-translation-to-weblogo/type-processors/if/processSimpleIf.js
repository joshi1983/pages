import { processToken } from '../processToken.js';

export function processSimpleIf(token, result, cachedParseTree, settings) {
	const conditionToken = token.children[0];
	const instructionsToken = token.children[2];
	result.append('if ');
	processToken(conditionToken, result, cachedParseTree, settings);
	result.append(' [\n');
	processToken(instructionsToken, result, cachedParseTree, settings);
	result.append('\n]\n');
};