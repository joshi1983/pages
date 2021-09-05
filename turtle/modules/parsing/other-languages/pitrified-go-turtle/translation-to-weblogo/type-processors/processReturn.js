import { processTokens } from './helpers/processTokens.js';

export function processReturn(token, result, settings) {
	const children = token.children;
	if (children.length === 0) {
		result.append('stop');
	}
	else {
		result.append('\noutput ');
		processTokens(token.children, result, settings);
	}
};