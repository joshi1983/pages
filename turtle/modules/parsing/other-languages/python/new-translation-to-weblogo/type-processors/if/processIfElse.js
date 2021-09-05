import { getElseInstructionsToken } from './getElseInstructionsToken.js';
import { processToken } from '../processToken.js';

export function processIfElse(token, result, cachedParseTree, settings) {
	const conditionToken = token.children[0];
	const instructionsToken = token.children[2];
	const elseInstructionsToken = getElseInstructionsToken(token);
	result.append('ifelse ');
	processToken(conditionToken, result, cachedParseTree, settings);
	result.append(' [\n');
	processToken(instructionsToken, result, cachedParseTree, settings);
	result.append('\n] [\n');
	processToken(elseInstructionsToken, result, cachedParseTree, settings);
	result.append('\n]\n');
};