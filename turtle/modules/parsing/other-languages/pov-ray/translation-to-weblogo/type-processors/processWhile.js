import { processToken } from './processToken.js';

export function processWhile(token, result) {
	result.processCommentsUpToToken(token);
	if (token.children.length !== 0) {
		const conditionToken = token.children[0];
		const instructionListToken = token.children[1];
		result.append(`while `);
		processToken(conditionToken, result);
		result.append(' [\n');
		if (instructionListToken !== undefined)
			processToken(instructionListToken, result);
		result.append('\n]\n');
	}
	else {
		result.append('; Failed to translate #while because of missing condition and instructions\n');
	}
};