import { forTokenToCodeBlock } from './forTokenToCodeBlock.js';
import { forTokenToInitialValue } from './forTokenToInitialValue.js';
import { forTokenToInitVariableName } from './forTokenToInitVariableName.js';
import { forToStepValue } from './forToStepValue.js';
import { getVariableReadsOfConcernForRepeat } from
'./getVariableReadsOfConcernForRepeat.js';

export function forTokenCodeBlockContainsVariableReadUntranslatableToRepcount(forToken) {
	const codeBlock = forTokenToCodeBlock(forToken);
	if (codeBlock === null)
		return false;

	const initVal = forTokenToInitialValue(forToken);
	const stepVal = forToStepValue(forToken);

	// if initial value or step don't match what WebLogo's repcount would return...
	if (initVal !== 1 || stepVal !== 1) {
		const variableName = forTokenToInitVariableName(forToken);
		const affectedReads = getVariableReadsOfConcernForRepeat(codeBlock, variableName);
		if (affectedReads.size !== 0) {
			// too difficult to translate the variable references to repcount when repcount is always 1,2,.. a larger number.
			return true;
		}
	}
	return false;
};