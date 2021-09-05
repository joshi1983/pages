import { getClosestOfType } from '../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function getProcedureStartToken(token) {
	return getClosestOfType(token, ParseTreeTokenType.PROCEDURE_START_KEYWORD);
};