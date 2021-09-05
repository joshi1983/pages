import { getElseInstructionsToken } from './getElseInstructionsToken.js';
import { processToken } from '../processToken.js';

export function processIfElse(token, result, cachedParseTree) {
	const conditionToken = token.children[0];
	const instructionsToken = token.children[2];
	const elseInstructionsToken = getElseInstructionsToken(token);
	result.append('ifelse ');
	processToken(conditionToken, result, cachedParseTree);
	result.append(' [\n');
	processToken(instructionsToken, result, cachedParseTree);
	result.append('\n] [\n');
	processToken(elseInstructionsToken, result, cachedParseTree);
	result.append('\n]\n');
};