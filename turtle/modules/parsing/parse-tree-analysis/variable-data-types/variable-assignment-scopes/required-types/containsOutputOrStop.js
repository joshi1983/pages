import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isOutputOrStopCall } from
'./isOutputOrStopCall.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

export function containsOutputOrStop(token) {
	if (isOutputOrStopCall(token))
		return true;
	return getDescendentsOfType(token, ParseTreeTokenType.PARAMETERIZED_GROUP).
		some(isOutputOrStopCall);
};