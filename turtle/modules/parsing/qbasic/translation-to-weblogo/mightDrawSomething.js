import { functionCallToFunctionName } from '../parsing/functionCallToFunctionName.js';
import { getDescendentsOfType } from '../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { QBasicInternalFunctions } from '../QBasicInternalFunctions.js';

const drawingFunctionNames = new Set([
	'circle', 'draw', 'line', 'preset', 'pset'
]);

function mightDrawSomethingCall(token) {
	const name = functionCallToFunctionName(token);
	const info = QBasicInternalFunctions.getFunctionInfo(name);
	if (info === undefined)
		return false;
	return drawingFunctionNames.has(info.primaryName.toLowerCase());
}

export function mightDrawSomething(root) {
	return getDescendentsOfType(root, ParseTreeTokenType.FUNCTION_CALL).some(mightDrawSomethingCall);
};