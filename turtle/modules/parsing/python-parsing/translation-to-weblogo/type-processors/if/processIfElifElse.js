import { getElifConditionToken } from './getElifConditionToken.js';
import { getElifInstructionsToken } from './getElifInstructionsToken.js';
import { getElseInstructionsToken } from './getElseInstructionsToken.js';
import { processToken } from '../../processToken.js';

export function processIfElifElse(token, result, cachedParseTree) {
	const conditionToken = token.children[0];
	const instructionsToken = token.children[2];
	const elseInstructionsToken = getElseInstructionsToken(token);
	const elifConditionToken = getElifConditionToken(token);
	const elifInstructionsToken = getElifInstructionsToken(token);
	result.append('ifelse ');
	processToken(conditionToken, result, cachedParseTree);
	result.append(' [\n');
	processToken(instructionsToken, result, cachedParseTree);
	result.append('\n] [\nifelse ');
	processToken(elifConditionToken, result, cachedParseTree);
	result.append(' [\n');
	processToken(elifInstructionsToken, result, cachedParseTree);
	result.append('\n] [\n');
	processToken(elseInstructionsToken, result, cachedParseTree);
	result.append('\n]\n]\n');
};