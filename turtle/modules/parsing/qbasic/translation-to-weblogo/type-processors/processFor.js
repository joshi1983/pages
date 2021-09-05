import { getCodeBlockFromFor } from './for-loops/getCodeBlockFromFor.js';
import { getCounterVariableNameFromFor } from './for-loops/getCounterVariableNameFromFor.js';
import { isTranslatableToRepeat } from './for-loops/isTranslatableToRepeat.js';
import { isTranslatableToSimpleRepeat } from './for-loops/isTranslatableToSimpleRepeat.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';
import { setProcessTokenForToken } from './helpers/setProcessTokenForToken.js';

function translateToRepcount(token, result) {
	result.append(' repcount ');
}

function processRepcountTranslations(token, variableName, options) {
	if (token.type === ParseTreeTokenType.IDENTIFIER &&
	token.parentNode.type !== ParseTreeTokenType.FUNCTION_CALL &&
	token.val.toLowerCase() === variableName) {
		setProcessTokenForToken(token, translateToRepcount, options);
	}
	if (isTranslatableToRepeat(token))
		return;
	for (const child of token.children) {
		processRepcountTranslations(child, variableName, options);
	}
}

export function processFor(token, result, options) {
	const codeBlock = getCodeBlockFromFor(token);
	if (codeBlock === undefined)
		return;
	if (isTranslatableToSimpleRepeat(token)) {
		const children = token.children;
		const variableName = getCounterVariableNameFromFor(token);
		result.append('repeat ');
		processToken(children[0].children[1], result, options);
		processRepcountTranslations(codeBlock, variableName, options);
		processToken(codeBlock, result, options);
	}
};