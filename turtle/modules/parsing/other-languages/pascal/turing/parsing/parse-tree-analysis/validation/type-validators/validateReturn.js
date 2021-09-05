import { getClosestOfType } from
'../../../../../../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateReturn(token, parseLogger) {
	const functionToken = getClosestOfType(token, ParseTreeTokenType.PROCEDURE);
	if (functionToken === null)
		parseLogger.error(`Expected RETURN to be in a PROCEDURE but could not find a containing PROCEDURE.`, token);
};