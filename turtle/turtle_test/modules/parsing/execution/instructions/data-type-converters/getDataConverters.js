import { argInfoToCheckFunction, needsArgInfoCheck } from '../../../compiling/instruction-list-optimization/instructions-to-JavaScript/argInfoToCheckFunction.js';
import { Colour } from '../../../../Colour.js';
import { convertToAlphaColour } from './convertToAlphaColour.js';
import { convertToAlphaColourOrTransparent } from './convertToAlphaColourOrTransparent.js';
import { convertToColour } from './convertToColour.js';
import { convertToColourOrTransparent } from './convertToColourOrTransparent.js';
import { convertToStepPosition } from './convertToStepPosition.js';
import { convertToDataTypes } from './convertToDataTypes.js';
import { JavaScriptInstruction } from '../JavaScriptInstruction.js';
import { LineCap } from '../../../../drawing/vector/shapes/style/LineCap.js';
import { LogoRuntimeException } from '../../LogoRuntimeException.js';
import { validateList } from './validateList.js';
import { validateListOrString } from './validateListOrString.js';
import { validateNumber } from './validateNumber.js';
import { validateString } from './validateString.js';
import { validateVariableReference } from './validateVariableReference.js';

function noop(val) {
	return val;
}

const Sanitizers = {
	'dataTypes': convertToDataTypes,
	'lineCap': LineCap.parse,
	'listToString': function(val) {
		if (val instanceof Array)
			return JavaScriptInstruction.convertListToString(val);
		else if (typeof val === 'string')
			return val;
		else
			throw new LogoRuntimeException(`value must either be a list or a string but is neither`);
	}
};

export function getDataConverters(command, numArgs, parseTreeToken) {
	const result = [];
	for (let i = 0; i < numArgs; i++) {
		let wrapperFunc = noop;
		if (i < command.args.length) {
			const argInfo = command.args[i];
			if (argInfo.sanitization === 'convertToStepPosition')
				wrapperFunc = convertToStepPosition;
			else if (typeof argInfo.sanitization === 'string')
				wrapperFunc = Sanitizers[command.args[i].sanitization];
			else if (argInfo.types === 'alphacolor')
				wrapperFunc = convertToAlphaColour;
			else if (argInfo.types === 'alphacolor|transparent')
				wrapperFunc = convertToAlphaColourOrTransparent;
			else if (argInfo.types === 'color')
				wrapperFunc = convertToColour;
			else if (argInfo.types === 'color|transparent')
				wrapperFunc = convertToColourOrTransparent;
			else if (argInfo.types === 'list')
				wrapperFunc = validateList;
			else if (argInfo.types === 'list|string') {
				wrapperFunc = validateListOrString;
			}
			else if (argInfo.types === 'num')
				wrapperFunc = validateNumber;
			else if (argInfo.types === 'string') {
				if (argInfo.refTypes === undefined)
					wrapperFunc = validateString;
				else
					wrapperFunc = validateVariableReference(command.args[i].refTypes);
			}
			if (needsArgInfoCheck(argInfo) === true) {
				const name = `Parameter ${argInfo.name} in command ${command.primaryName}`;
				const errorCaseCheckFunc = argInfoToCheckFunction(argInfo, name, parseTreeToken);
				if (wrapperFunc === noop)
					wrapperFunc = errorCaseCheckFunc;
				else {
					const originalWrapperFunc = wrapperFunc;
					wrapperFunc = function(val) {
						return errorCaseCheckFunc(originalWrapperFunc(val));
					};
				}
			}
		}
		result.push(wrapperFunc);
	}
	return result;
};