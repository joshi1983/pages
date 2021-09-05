import { getElseChild } from './helpers/getElseChild.js';
import { processToken } from './processToken.js';
import { processTokens } from './processTokens.js';

export function processIf(token, result) {
	result.processCommentsUpToToken(token);
	if (token.children.length !== 0) {
		const conditionToken = token.children[0];
		const instructionListToken = token.children[1];
		const elseToken = getElseChild(token);
		if (elseToken !== null)
			result.append(`ifElse `);
		else
			result.append(`if `);
		processToken(conditionToken, result);
		result.append(' [\n');
		if (instructionListToken !== undefined)
			processToken(instructionListToken, result);
		result.append('\n]\n');
		if (elseToken !== null) {
			result.append(' [\n');
			const instructionList = elseToken.children[0];
			if (instructionList !== undefined) {
				processTokens(instructionList.children, result);
			}
			result.append('\n]\n');
		}
	}
	else {
		result.append('; Failed to translate #if because of missing condition and instructions\n');
	}
};