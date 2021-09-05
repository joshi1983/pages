import { processToken } from './processToken.js';

export function processExit(token, result) {
	const whenToken = token.children[0];
	if (whenToken === undefined)
		return; // unable to translate.  Just give up.

	const conditionToken = whenToken.children[0];
	if (conditionToken === undefined)
		return; // Again, just give up.

	result.append('\nif ');
	processToken(conditionToken, result);
	result.append(' [\nbreak\n]\n');
};