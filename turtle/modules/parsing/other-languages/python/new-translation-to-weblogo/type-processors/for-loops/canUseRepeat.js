import { getForLoopVarName } from './getForLoopVarName.js';
import { getRepeatCount } from './getRepeatCount.js';
import { isVariableReadInLoop } from './isVariableReadInLoop.js';

export function canUseRepeat(token) {
	if (getRepeatCount(token) === undefined)
		return false;
	const variableName = getForLoopVarName(token);
	if (isVariableReadInLoop(variableName, token))
		return false;
	// FIXME: check more thoroughly to see if we can still return true 
	// if the variable reading is translated to a call to repcount.

	return true;
};