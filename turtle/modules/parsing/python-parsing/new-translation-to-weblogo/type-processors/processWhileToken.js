import { isLoopToken } from '../../parse-tree-analysis/isLoopToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

function isAlwaysTrue(token) {
	if (token.type === ParseTreeTokenType.BOOLEAN_LITERAL &&
	token.val === 'True')
		return true;
	return false;
}

function mightBreak(token) {
	if (isLoopToken(token))
		return false;
	if (token.type === ParseTreeTokenType.BREAK)
		return true;
	return token.children.some(child => mightBreak(child));
}

export function processWhileToken(token, result, cachedParseTree) {
	if (token.children.length < 3 && token.children.length > 4)
		throw new Error(`Expected children.length to be 3 or 4 for a while token but got ${token.children.length}`);
	const conditionToken = token.children[0];
	const instructionsToken = token.children[2];
	result.processCommentsUpToToken(token);
	if (isAlwaysTrue(conditionToken)) {
		result.append('forever [\n');
	}
	else {
		result.append('while ');
		processToken(conditionToken, result, cachedParseTree);
		result.append(' [\n');
	}
	processToken(instructionsToken, result, cachedParseTree);
	result.append('\n]\n');
	if (token.children.length === 4) {
		const elseToken = token.children[3];
		if (elseToken.children.length === 2) {
			const elseInstructionsToken = elseToken.children[1];
			if (mightBreak(instructionsToken)) {
				result.append('if not (');
				processToken(conditionToken, result, cachedParseTree);
				result.append(') [\n');
				processToken(elseInstructionsToken, result, cachedParseTree);
				result.append('\n]');
			}
			else {
				processToken(elseInstructionsToken, result, cachedParseTree);
			}
		}
		result.append('\n');
	}
};