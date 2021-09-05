import { getElifConditionToken } from './getElifConditionToken.js';
import { getElifInstructionsToken } from './getElifInstructionsToken.js';
import { processToken } from '../../processToken.js';

export function processIfElif(token, result, cachedParseTree) {
	const conditionToken = token.children[0];
	const instructionsToken = token.children[2];
	const elifConditionToken = getElifConditionToken(token);
	const elifInstructionsToken = getElifInstructionsToken(token);
	result.append('ifelse ');
	processToken(conditionToken, result, cachedParseTree);
	result.append(' [\n');
	processToken(instructionsToken, result, cachedParseTree);
	result.append('\n] [\nif ');
	processToken(elifConditionToken, result, cachedParseTree);
	result.append(' [\n');
	processToken(elifInstructionsToken, result, cachedParseTree);
	result.append('\n]\n]\n');
};