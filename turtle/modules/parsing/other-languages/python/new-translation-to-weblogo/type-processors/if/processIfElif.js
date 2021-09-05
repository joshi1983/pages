import { getElifConditionToken } from './getElifConditionToken.js';
import { getElifInstructionsToken } from './getElifInstructionsToken.js';
import { processToken } from '../processToken.js';

export function processIfElif(token, result, cachedParseTree, settings) {
	const conditionToken = token.children[0];
	const codeBlockToken = token.children[2];
	const elifConditionToken = getElifConditionToken(token);
	const elifInstructionsToken = getElifInstructionsToken(token);
	result.append('ifelse ');
	processToken(conditionToken, result, cachedParseTree, settings);
	result.append(' [\n');
	processToken(codeBlockToken, result, cachedParseTree, settings);
	result.append('\n] [\nif ');
	processToken(elifConditionToken, result, cachedParseTree, settings);
	result.append(' [\n');
	processToken(elifInstructionsToken, result, cachedParseTree, settings);
	result.append('\n]\n]\n');
};