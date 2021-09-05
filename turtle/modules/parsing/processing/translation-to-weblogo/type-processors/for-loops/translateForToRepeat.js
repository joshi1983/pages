import { forTokenToCodeBlock } from './forTokenToCodeBlock.js';
import { forToConditionToken } from './forToConditionToken.js';
import { forTokenToInitialValue } from './forTokenToInitialValue.js';
import { forTokenToInitVariableName } from './forTokenToInitVariableName.js';
import { forTokenToRepeatCount } from './forTokenToRepeatCount.js';
import { forToStepValue } from './forToStepValue.js';
import { getVariableReadsOfConcernForRepeat } from
'./getVariableReadsOfConcernForRepeat.js';
import { isNumber } from
'../../../../../isNumber.js';
import { mightVariableBeReadAfter } from
'../../../parsing/parse-tree-analysis/variable-data-types/mightVariableBeReadAfter.js';
import { processToken } from '../processToken.js';
import { shouldUseLocalmake } from '../operators/shouldUseLocalmake.js';
import { valueToLiteralCode } from
'../../../../../valueToLiteralCode.js';

function addRepcount(token, result, settings) {
	result.append(' repcount ');
}

export function translateForToRepeat(forToken, result, settings) {
	const repeatLimit = forTokenToRepeatCount(forToken);
	const codeBlock = forTokenToCodeBlock(forToken);
	const variableName = forTokenToInitVariableName(forToken);
	let initValue;
	let stepValue;
	result.append('\nrepeat ');
	if (Number.isInteger(repeatLimit))
		result.append(repeatLimit + ' ');
	else {
		// process the expression.
		initValue = forTokenToInitialValue(forToken);
		stepValue = forToStepValue(forToken);
		const isDivideByStepValueNeeded = stepValue !== 1;
		if (isDivideByStepValueNeeded)
			result.append(' ( ');

		const conditionToken = forToConditionToken(forToken);
		const limitToken = conditionToken.children.filter(t => t.val !== variableName)[0];
		processToken(limitToken, result, settings);
		
		if (initValue !== 0) {
			if (initValue > 0)
				result.append(` - ${initValue}`);
			else
				result.append(` + ${-initValue}`);
		}

		if (isDivideByStepValueNeeded)
			result.append(` ) /  ${stepValue}`);
	}
	if (codeBlock !== null) {
		const affectedVariableReads = getVariableReadsOfConcernForRepeat(codeBlock, variableName);
		for (const variableRead of affectedVariableReads) {
			settings.tokenProcessors.set(variableRead, addRepcount);
		}
		processToken(codeBlock, result, settings);
	}
	if (mightVariableBeReadAfter(forToken, variableName)) {
		let makeCommand = 'make';
		if (shouldUseLocalmake(forToken))
			makeCommand = 'localmake';
		if (initValue === undefined)
			initValue = forTokenToInitialValue(forToken);
		if (stepValue === undefined)
			stepValue = forToStepValue(forToken);
			
		const afterValue = initValue + stepValue * repeatLimit;
		if (isNumber(afterValue)) {
			result.append(`\n${makeCommand} ${valueToLiteralCode(variableName)} ${afterValue}\n`);
		}
	}
};