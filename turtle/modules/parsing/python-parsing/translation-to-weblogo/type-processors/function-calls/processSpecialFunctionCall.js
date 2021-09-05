import { processAbsCall } from './processAbsCall.js';
import { processAppendCall } from './processAppendCall.js';
import { processCircleCall } from './processCircleCall.js';
import { processColorCall } from './processColorCall.js';
import { processDegreesCall } from './processDegreesCall.js';
import { processDotCall } from './processDotCall.js';
import { processRadiansCall } from './processRadiansCall.js';

const nameToFunctionMap = new Map([
	['abs', processAbsCall],
	['append', processAppendCall],
	['circle', processCircleCall],
	['color', processColorCall],
	['degrees', processDegreesCall],
	['dot', processDotCall],
	['radians', processRadiansCall],
]);

export function processSpecialFunctionCall(token, result, cachedParseTree) {
	if (nameToFunctionMap.has(token.val)) {
		if (false === nameToFunctionMap.get(token.val)(token, result, cachedParseTree))
			return false;
		return true; // indicate processed.
	}
	return false;
};