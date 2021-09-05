import { getIteratorToken } from './getIteratorToken.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

const typesNeedingNewVariable = new Set([
ParseTreeTokenType.LIST_LITERAL,
ParseTreeTokenType.TUPLE_LITERAL
]);

export function isNeedingNewVariable(forToken) {
	const iteratorToken = getIteratorToken(forToken);
	if (typesNeedingNewVariable.has(iteratorToken.type))
		return true;
	return false;
};