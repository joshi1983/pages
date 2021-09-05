import { processToken } from './processToken.js';

export function processFunction(token, result) {
	result.append('\n');
	if (token.children.length === 1) {
		const codeBlock = token.children[0];
		if (codeBlock.children.length > 1) {
			const instructionList = codeBlock.children[1];
			processToken(instructionList, result);
		}
	}
	else
		result.append(`; failed to translate function\n`);
};