import { getClosestOfType } from '../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function getGoodParentToken(token) {
	const forSettingsToken = getClosestOfType(token, ParseTreeTokenType.FOR_LOOP_SETTINGS);
	if (forSettingsToken !== null)
		return forSettingsToken;
	return token;
}

/*
for...of loops are documented at:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
*/
export function processOf(previousToken, nextToken) {
	previousToken = getGoodParentToken(previousToken);
	previousToken.appendChild(nextToken);
};