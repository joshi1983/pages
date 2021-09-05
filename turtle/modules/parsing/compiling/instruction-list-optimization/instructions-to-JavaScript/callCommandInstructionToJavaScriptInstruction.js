import { Command } from '../../../Command.js';
import { getCommandPath } from './getCommandPath.js';
import { JavaScriptInstruction } from '../../../execution/instructions/JavaScriptInstruction.js';
import { getInstructionParamArgInfo } from './getInstructionParamArgInfo.js';
import { MapUtils } from '../../../../MapUtils.js';
import { wrapWithTypeConverter } from './wrapWithTypeConverter.js';
await Command.asyncInit();

export function callCommandInstructionToJavaScriptInstruction(instruction, pushResult, compileOptions) {
	if (typeof compileOptions !== 'object')
		throw new Error('compileOptions must be an object but got ' + compileOptions);
	let commandGroup = instruction.command.commandGroup;
	let primaryName = Command.getMethodNameFor(instruction.command);
	let expr = getCommandPath(instruction.command) + '(';
	const namedFunctionsMap = new Map();
	let actualParams = [];
	for (let i = instruction.numArgs - 1; i >= 0; i--) {
		let code = `context.valueStack[context.valueStack.length - ${instruction.numArgs - i}]`;
		if (instruction.skipValidationAndSanitization !== true) {
			const argInfo = getInstructionParamArgInfo(instruction, i);
			const wrapResult = wrapWithTypeConverter(code, argInfo, compileOptions.forProduction === true,
				instruction.command.primaryName, instruction.parseTreeToken);
			code = wrapResult.code;
			MapUtils.merge(namedFunctionsMap, wrapResult.namedFunctionsMap);
		}
		actualParams.push(code);
	}
	expr += actualParams.reverse().join(',') + ')';
	let result = expr;
	if (pushResult) {
		result = `context.valueStack[context.valueStack.length - ${instruction.numArgs}] = ${expr};`;
	}
	if (instruction.numArgs > 1)
		result += `\ncontext.valueStack.length -= ${instruction.numArgs - 1};`;

	return new JavaScriptInstruction(result, instruction.parseTreeToken, namedFunctionsMap);
};