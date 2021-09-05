import { getConditionToken } from './getConditionToken.js';
import { getIncrementToken } from './getIncrementToken.js';
import { getInitialToken } from './getInitialToken.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

const typesToIgnore = new Set([
ParseTreeTokenType.CURLY_LEFT_BRACKET,
ParseTreeTokenType.CURLY_RIGHT_BRACKET
]);

export function processForToWhile(processToken, token, result, settings) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken expected to be a function but got ${processToken}`);
	const initToken = getInitialToken(token);
	const conditionToken = getConditionToken(token);
	const incrementToken = getIncrementToken(token);
	if (initToken !== undefined) {
		processToken(initToken, result, settings);
		result.append('\n');
	}
	if (conditionToken === undefined)
		result.append('forever');
	else {
		result.append('while ');
		processToken(conditionToken, result, settings);
	}
	result.append(' [');
	const codeBlock = token.children[1];
	if (codeBlock !== undefined) {
		for (let child of codeBlock.children) {
			if (!typesToIgnore.has(child.type)) {
				result.append('\n\t');
				processToken(child, result, settings);
			}
		}
	}
	if (incrementToken !== undefined) {
		result.append('\n\t');
		processToken(incrementToken, result, settings);
	}
	result.append('\n]\n');
};