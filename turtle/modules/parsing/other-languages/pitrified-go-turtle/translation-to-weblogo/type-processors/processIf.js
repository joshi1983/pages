import { processToken } from './processToken.js';

export function processIf(token, result, settings) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	const condition = children[0];
	if (condition !== undefined) {
		const commandName = children.length <= 2 ? 'if' : 'ifelse';
		result.append(`\n${commandName} `);
		processToken(condition, result, settings);
		result.append(' [\n');
		if (children.length > 1)
			processToken(children[1], result, settings);
		result.append('\n]\n');
		if (commandName === 'ifelse') {
			result.append('[\n');
			for (let i = 2; i < children.length; i++) {
				processToken(children[i], result, settings);
			}
			result.append('\n]\n');
		}
	}
};