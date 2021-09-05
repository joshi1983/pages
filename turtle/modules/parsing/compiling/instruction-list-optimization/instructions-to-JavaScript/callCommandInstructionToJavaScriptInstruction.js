import { Command } from '../../../Command.js';
import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';
import { getInstructionParamRefTypes } from './getInstructionParamRefTypes.js';
import { getInstructionParamTypes } from './getInstructionParamTypes.js';
import { getInstructionParamSanitization } from './getInstructionParamSanitization.js';
import { instructionToJavaScript } from './instructionToJavaScript.js';
import { wrapWithTypeConverter } from './wrapWithTypeConverter.js';
await Command.asyncInit();

export function callCommandInstructionToJavaScriptInstruction(instruction, pushResult, compileOptions) {
	if (typeof compileOptions !== 'object')
		throw new Error('compileOptions must be an object but got ' + compileOptions);
	let commandGroup = instruction.command.commandGroup;
	let primaryName = Command.getMethodNameFor(instruction.command);
	let expr;
	if (commandGroup === 'compiled')
		expr = `context.${primaryName}(`;
	else
		expr = `context.${commandGroup}.${primaryName}(`;
	let actualParams = [];
	for (let i = instruction.numArgs - 1; i >= 0; i--) {
		let code = `context.valueStack[context.valueStack.length - ${instruction.numArgs - i}]`;
		const types = getInstructionParamTypes(instruction, i);
		const sanitization = getInstructionParamSanitization(instruction, i);
		const refTypes = getInstructionParamRefTypes(instruction, i);
		if (instruction.skipValidationAndSanitization !== true)
			code = wrapWithTypeConverter(code, types, sanitization, refTypes, compileOptions.forProduction === true);
		actualParams.push(code);
	}
	expr += actualParams.reverse().join(',') + ')';
	let result = '';
	if (pushResult) {
		result = `context.valueStack[context.valueStack.length - ${instruction.numArgs}] = ${expr};`;
	}
	if (instruction.numArgs > 1)
		result += `\ncontext.valueStack.length -= ${instruction.numArgs - 1};`;

	return new JavaScriptInstruction(result, instruction.parseTreeToken);
};