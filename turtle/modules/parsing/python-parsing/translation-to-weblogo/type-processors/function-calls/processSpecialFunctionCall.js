import { processAbsCall } from './processAbsCall.js';
import { processAppendCall } from './processAppendCall.js';
import { processCircleCall } from './processCircleCall.js';
import { processColorCall } from './processColorCall.js';
import { processDegreesCall } from './processDegreesCall.js';
import { processDictCall } from './processDictCall.js';
import { processDotCall } from './processDotCall.js';
import { processPenCall } from './processPenCall.js';
import { processRadiansCall } from './processRadiansCall.js';
import { processSetHeadingCall } from './processSetHeadingCall.js';

const nameToFunctionMap = new Map([
	['abs', processAbsCall],
	['append', processAppendCall],
	['circle', processCircleCall],
	['color', processColorCall],
	['degrees', processDegreesCall],
	['dict', processDictCall],
	['dot', processDotCall],
	['pen', processPenCall],
	['radians', processRadiansCall],
	['seth', processSetHeadingCall],
	['setheading', processSetHeadingCall],
]);

export function processSpecialFunctionCall(token, result, cachedParseTree) {
	if (nameToFunctionMap.has(token.val)) {
		if (false === nameToFunctionMap.get(token.val)(token, result, cachedParseTree))
			return false;
		return true; // indicate processed.
	}
	return false;
};