import { processTokens } from
'./helpers/processTokens.js';

export function processLoop(token, result) {
	const children = token.children;
	if (children.length !== 0) {
		result.append('\nforever [\n');
		processTokens(children, result);
		
		result.append('\n]\n');
	}
};