import { isArgListKeyword, tokenValsFunctionNames } from './isArgListKeyword.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function isMismatchedArgListKeyword(prev, next) {
	if (prev.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	const parent = prev.parentNode;
	if (parent.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	const nameToken = parent.children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER ||
	!tokenValsFunctionNames.has(nameToken.val.toLowerCase()))
		return false;

	return !isArgListKeyword(prev, next);
};