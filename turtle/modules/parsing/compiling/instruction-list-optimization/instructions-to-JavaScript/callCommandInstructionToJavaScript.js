import { Command } from '../../../Command.js';
import { getArgPushIndex } from '../getArgPushIndex.js';
import { getInstructionParamRefTypes } from './getInstructionParamRefTypes.js';
import { getInstructionParamTypes } from './getInstructionParamTypes.js';
import { getInstructionParamSanitization } from './getInstructionParamSanitization.js';
import { instructionToJavaScript } from './instructionToJavaScript.js';
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
	let commandGroup = instruction.command.commandGroup;
	let primaryName = Command.getMethodNameFor(instruction.command);
	let result;
	if (commandGroup === 'compiled')
		result = `context.${primaryName}(`;
	else
		result = `context.${commandGroup}.${primaryName}(`;
	let pushIndex = index - 1;
	let actualParams = [];
	for (let i = instruction.numArgs - 1; i >= 0; i--) {
		let code = instructionToJavaScript(instructions, pushIndex, info, compileOptions);
		if (code === '')
			throw new Error('code is empty for instructions with pushIndex ' + pushIndex + ', info = ' + JSON.stringify(info));
		if (typeof code !== 'string')
			throw new Error('code expected to be a string but is not.  code = ' + code);

		const types = getInstructionParamTypes(instruction, i);
		const sanitization = getInstructionParamSanitization(instruction, i);
		const refTypes = getInstructionParamRefTypes(instruction, i);
		if (instruction.skipValidationAndSanitization !== true)
			code = wrapWithTypeConverter(code, types, sanitization, refTypes, compileOptions.forProduction === true);
		actualParams.push(code);
		pushIndex = getArgPushIndex(instructions, pushIndex, 1);
	}
	result += actualParams.reverse().join(',') + ')';
	if (pushResult) {
		result = 'context.valueStack.push(' + result + ');';
	}
	return result;
};