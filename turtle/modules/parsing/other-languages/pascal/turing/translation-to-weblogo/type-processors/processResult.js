import { processToken } from
'./processToken.js';

export function processResult(token, result) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (children.length === 0)
		result.append('\nstop\n');
	else {
		result.append('\noutput ');
		processToken(children[0], result);
		result.append('\n');
	}
};