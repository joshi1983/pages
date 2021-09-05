import { processToken } from './processToken.js';

export function processReturn(token, result, settings) {
	result.processCommentsUpToToken(token);
	const firstChild = token.children[0];
	if (firstChild === undefined)
		result.append('\nstop\n');
	else {
		result.append('\noutput ');
		processToken(firstChild, result, settings);
		result.append('\n');
	}
};