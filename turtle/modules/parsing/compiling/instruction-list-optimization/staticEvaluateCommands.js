import { CallCommandInstruction } from '../../execution/instructions/CallCommandInstruction.js';
import { convertArgsUsingArgsInfo } from '../../execution/instructions/data-type-converters/convertArgsUsingArgsInfo.js';
import { convertToStepPosition } from '../../execution/instructions/data-type-converters/convertToStepPosition.js';
import { convertToDataTypes } from '../../execution/instructions/data-type-converters/convertToDataTypes.js';
import { getCommandGroups } from '../../../command-groups/getCommandGroups.js';
import { isConstantPush } from './isConstantPush.js';
import { PushInstruction } from '../../execution/instructions/PushInstruction.js';
import { removeInstructions } from './removeInstructions.js';
import { shouldValueBeCloned } from '../shouldValueBeCloned.js';

const commandGroups = getCommandGroups();

export function staticEvaluateCommand(instructions, i) {
	const instruction = instructions[i];
	if (!(instruction instanceof CallCommandInstruction))
		throw new Error('i must be the index of a CallCommandInstruction');

	const commandInfo = instruction.command;
	let inputs = [];
	for (let j = 0; j < instruction.numArgs; j++) {
		if (isConstantPush(instructions[i - instruction.numArgs + j]) === true) {
			let input = instructions[i - instruction.numArgs + j].value;
			let argInfo = j < commandInfo.args.length ? commandInfo.args[j] : undefined;
			if (argInfo !== undefined) {
				if (argInfo.sanitization === 'convertToStepPosition')
					input = convertToStepPosition(input);
				else if (argInfo.sanitization === 'dataTypes')
					input = convertToDataTypes(input);
			}
			inputs.push(input);
		}
		else {
			return false;
		}
	}
	const commandGroupName = instruction.command.commandGroup;
	const commandName = instruction.command.primaryName;
	const commandGroup = commandGroups.get(commandGroupName);
	if (commandGroup === undefined)
		throw new Error('Unable to find commandGroup ' + commandGroupName + '.  If it is turtle or compiled, it should not be isStaticEvaluationSafe.');

	inputs = convertArgsUsingArgsInfo(inputs, commandInfo.args);
	const result = commandGroup[commandName](...inputs);
	const parseTreeToken = instructions[i].parseTreeToken;
	i -= instruction.numArgs;
	removeInstructions(instructions, i + 1, instruction.numArgs);
	instructions[i] = new PushInstruction(result, parseTreeToken, shouldValueBeCloned(result));
	return true;
}

export function staticEvaluateCommands(instructions) {
	for (let i = 0; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction instanceof CallCommandInstruction && instruction.command.isStaticEvaluationSafe) {
			if (staticEvaluateCommand(instructions, i))
				i -= instruction.numArgs;
		}
	}
};