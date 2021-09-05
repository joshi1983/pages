import { processToken } from './processToken.js';

export function processDoUntil(token, result) {
	const children = token.children;
	const untilToken = children[1];
	const codeBlock = children[2];
	if (codeBlock === undefined)
		return; // weird case. token is not structured well.  It likely came from invalid QBasic code.
	const condition = untilToken.children[0];
	if (condition === undefined)
		return; // weird case.  The parsed QBasic code was likely invalid.
	result.append('while not (');
	processToken(condition, result);
	result.append(' ) ');
	processToken(codeBlock, result);
};