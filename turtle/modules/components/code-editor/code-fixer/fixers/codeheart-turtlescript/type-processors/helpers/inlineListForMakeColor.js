import { argListToParameterValueTokens } from '../function-calls/argListToParameterValueTokens.js';
import { ParseTreeTokenType } from '../../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processColourArguments } from '../function-calls/processColourArguments.js';

export function isMakeColorCall(token) {
	if (token.children.length !== 2)
		return false;
	const child = token.children[0];
	if (child.type !== ParseTreeTokenType.IDENTIFIER ||
	child.val !== 'makeColor')
		return false;
	return true;
}

export function inlineListForMakeColor(token, result) {
	if (token.type === ParseTreeTokenType.FUNCTION_CALL &&
	token.children.length > 1)
		token = token.children[1];
	processColourArguments(argListToParameterValueTokens(token), result, 255);
};