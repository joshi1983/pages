import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function isFunctionDefinition(name, functionToken) {
	if (typeof name !== 'string')
		return false;
	if (typeof functionToken !== 'object' || functionToken === null)
		return false;
	if (functionToken.type !== ParseTreeTokenType.FUNCTION)
		return false;
	return true;
};