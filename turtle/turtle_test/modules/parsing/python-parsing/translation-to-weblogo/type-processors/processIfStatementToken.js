import { ArrayUtils } from '../../../../ArrayUtils.js';
import { processToken } from '../processToken.js';

function hasElseOrElif(token) {
	return token.children.length > 3;
}

function hasElif(token) {
	return token.children.some(child => child.val === 'elif');
}

function getElifConditionToken(token) {
	return token.children[4];
}

function getElifInstructionsToken(token) {
	const index = ArrayUtils.indexOfMatch(token.children, (child) => child.val === 'elif');
	return token.children[index + 3];
	// index + 1 is index of the elif condition token
	// index + 2 is index of a colon(:).
}

function hasElse(token) {
	return token.children.some(child => child.val === 'else');
}

function getElseInstructionsToken(token) {
	if (hasElseOrElif(token)) {
		return token.children[token.children.length - 1];
	}
}

function processIfElse(token, result, cachedParseTree) {
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
}

function processIfElif(token, result, cachedParseTree) {
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
}

function processIfElifElse(token, result, cachedParseTree) {
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
}

function processSimpleIf(token, result, cachedParseTree) {
	const conditionToken = token.children[0];
	const instructionsToken = token.children[2];
	result.append('if ');
	processToken(conditionToken, result, cachedParseTree);
	result.append(' [\n');
	processToken(instructionsToken, result, cachedParseTree);
	result.append('\n]\n');
}

export function processIfStatementToken(token, result, cachedParseTree) {
	if (token.children.length !== 3 && token.children.length < 6)
		throw new Error(`Expected 3, 6, or more children but got ${token.children.length}`);
	result.processCommentsUpToToken(token);
	if (!hasElse(token)) {
		if (hasElif(token))
			processIfElif(token, result, cachedParseTree);
		else
			processSimpleIf(token, result, cachedParseTree);
	}
	else {
		if (hasElif(token))
			processIfElifElse(token, result, cachedParseTree);
		else
			processIfElse(token, result, cachedParseTree);
	}
};