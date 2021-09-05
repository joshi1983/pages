import { Command } from '../../../Command.js';
import { getArgPushIndex } from '../getArgPushIndex.js';
import { getCommandPath } from './getCommandPath.js';
import { getInstructionParamArgInfo } from './getInstructionParamArgInfo.js';
import { instructionToJavaScript } from './instructionToJavaScript.js';
import { MapUtils } from '../../../../MapUtils.js';
import { wrapWithTypeConverter } from './wrapWithTypeConverter.js';
await Command.asyncInit();

export function callCommandInstructionToJavaScript(instructions, index, info, pushResult, compileOptions) {
	if (typeof compileOptions !== 'object')
		throw new Error('compileOptions must be an object but got ' + compileOptions);
	if (!(instructions instanceof Array))
		throw new Error('instructions must be an Array.  Not: ' + instructions);
	if (!Number.isInteger(index) || index < 0)
		throw new Error('index must be a positive integer.  Not: ' + index);
	const instruction = instructions[index];
	if (instruction.command === undefined)
		throw new Error(`instructions ${index} does not have a command property.  instruction = ${instruction}`);

	let result = `${getCommandPath(instruction.command)}(`;
	let pushIndex = index - 1;
	let actualParams = [];
	const namedFunctionsMap = new Map();
	for (let i = instruction.numArgs - 1; i >= 0; i--) {
		let result1 = instructionToJavaScript(instructions, pushIndex, info, compileOptions);
		let code = result1.code;
		MapUtils.merge(namedFunctionsMap, result1.namedFunctionsMap);
		if (typeof result1.code !== 'string')
			throw new Error('code expected to be a string but is not.  code = ' + result1.code);

		if (instruction.skipValidationAndSanitization !== true) {
			const argInfo = getInstructionParamArgInfo(instruction, i);
			const wrapResult = wrapWithTypeConverter(code, argInfo,
				compileOptions.forProduction === true, instruction.command.primaryName, instruction.parseTreeToken);
			MapUtils.merge(namedFunctionsMap, wrapResult.namedFunctionsMap);
			code = wrapResult.code;
		}
		actualParams.push(code);
		pushIndex = getArgPushIndex(instructions, pushIndex, 1);
	}
	result += actualParams.reverse().join(',') + ')';
	if (pushResult) {
		result = 'context.valueStack.push(' + result + ');';
	}
	return {
		'code': result,
		'namedFunctionsMap': namedFunctionsMap
	};
};