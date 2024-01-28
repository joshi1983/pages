import { getAllDescendentsAsArray } from '../../../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getInstructionsToken } from './getInstructionsToken.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function isVariableReadInLoop(variableName, token) {
	if (typeof variableName !== 'string')
		throw new Error(`variableName must be a string but got ${variableName}`);

	const instructionsToken = getInstructionsToken(token);
	const readTokens = getAllDescendentsAsArray(instructionsToken).
		filter(t => t.type === ParseTreeTokenType.IDENTIFIER &&
			t.val === variableName);
	return readTokens.length !== 0;
};