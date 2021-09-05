import { getCodeBlockFromFor } from './for-loops/getCodeBlockFromFor.js';
import { getCounterVariableNameFromFor } from './for-loops/getCounterVariableNameFromFor.js';
import { getStepValueToken } from './for-loops/getStepValueToken.js';
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
	result.processCommentsUpToToken(token);
	const codeBlock = getCodeBlockFromFor(token);
	if (codeBlock === undefined)
		return;
	const variableName = getCounterVariableNameFromFor(token);
	if (variableName === undefined)
		return;
	const children = token.children;
	if (isTranslatableToSimpleRepeat(token)) {
		result.append('repeat ');
		processToken(children[0].children[1], result, options);
		result.append(' ');
		processRepcountTranslations(codeBlock, variableName, options);
		result.append(' ');
		processToken(codeBlock, result, options);
	}
	else {
		result.append(`for ["${options.identifierRenameMap.get(variableName.toLowerCase())} `);
		const toToken = children[0];
		const initValue = toToken.children[0].children[1];
		const toValue = toToken.children[1];
		const stepValue = getStepValueToken(token);
		processToken(initValue, result, options);
		result.append(' ');
		processToken(toValue, result, options);
		result.append(' ');
		if (stepValue !== undefined) {
			processToken(stepValue, result, options);
		}
		result.append(' ] ');
		processToken(codeBlock, result, options);
	}
};