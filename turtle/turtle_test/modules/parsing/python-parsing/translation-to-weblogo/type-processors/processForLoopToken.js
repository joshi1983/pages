import { canUseRepeat } from './for-loops/canUseRepeat.js';
import { cloneWithAllDescendents } from './helpers/cloneWithAllDescendents.js';
import { getIncrementStep } from './for-loops/getIncrementStep.js';
import { getForLoopVarName } from './for-loops/getForLoopVarName.js';
import { getInstructionsToken } from './for-loops/getInstructionsToken.js';
import { getRepeatCount } from './for-loops/getRepeatCount.js';
import { getStartValue } from './for-loops/getStartValue.js';
import { getStopValue } from './for-loops/getStopValue.js';
import { isNeedingNewVariable } from './for-loops/isNeedingNewVariable.js';
import { isForRangeWithVariableStop, processForRangeWithVariableStop } from './for-loops/processForRangeWithVariableStop.js';
import { isVariableReadInLoop } from './for-loops/isVariableReadInLoop.js';
import { isForVarInListLoop, processForInListLoop } from './for-loops/processForInListLoop.js';
import { processForElse } from './for-loops/processForElse.js';
import { processForInNewVariable } from './for-loops/processForInNewVariable.js';
import { processToken } from '../processToken.js';

export function processForLoopToken(token, result, cachedParseTree) {
	if (token.children.length !== 5 && token.children.length !== 8)
		throw new Error(`for loop tokens must have 5 or 8 children but found ${token.children.length}`);
	result.processCommentsUpToToken(token);
	result.append('\n');
	if (isNeedingNewVariable(token)) {
		processForInNewVariable(token, result, cachedParseTree);
	}
	else if (isForRangeWithVariableStop(token)) {
		processForRangeWithVariableStop(token, result, cachedParseTree);
	}
	else if (isForVarInListLoop(token)) {
		processForInListLoop(token, result, cachedParseTree);
	}
	else {
		const variableName = getForLoopVarName(token);
		if (canUseRepeat(token)) {
			result.append(`repeat ${getRepeatCount(token)} [\n`);
			let clonedToken = token;
			if (variableName !== undefined && isVariableReadInLoop(variableName, token)) {
				clonedToken = cloneWithAllDescendents(token);
				// FIXME: replace with calls to repcount() as if it were a 
				// Python function call so it translates to 'repcount' in WebLogo.
			}
			processToken(getInstructionsToken(clonedToken), result, cachedParseTree);
		}
		else {
			const start = getStartValue(token);
			if (getStopValue(token) === undefined)
				console.error(`getting undefined for a stop value which is problematic.`);
			const stop = getStopValue(token);
			const incrementStep = getIncrementStep(token);
			if (incrementStep === 1)
				result.append(`for ["${variableName} ${start} ${stop - 1}] [\n`);
			else
				result.append(`for ["${variableName} ${start} ${stop} ${incrementStep}] [\n`);
			if (variableName === undefined || start === undefined || stop === undefined) {
				result.append('; FIXME: review this for failed translation.\n');
				result.append('; One or more for-loop parameters could not be determined automatically.\n');
			}
			processToken(getInstructionsToken(token), result, cachedParseTree);
		}
		result.append('\n]');
	}
	if (token.children.length === 8) {
		processForElse(token, result, cachedParseTree);
	}
	result.append('\n');
};