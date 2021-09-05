import { CallCommandInstruction } from '../../execution/instructions/CallCommandInstruction.js';
import { CallHighOrderInstruction } from '../../execution/instructions/CallHighOrderInstruction.js';
import { getVariableName } from './getVariableName.js';
import { PushInstruction } from '../../execution/instructions/PushInstruction.js';

export function getVariablesAssignedAConstant(instructions) {
	const result = [];
	const excludedNames = new Set();
	for (let i = 2; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction instanceof CallHighOrderInstruction)
			return [];
		if (instruction instanceof CallCommandInstruction &&
			instruction.command.primaryName === 'localmake') {
				let nonConstFound = false;
				for (let j = 1; j <= instruction.numArgs; j++)
					if (!(instructions[i - j] instanceof PushInstruction)) {
						nonConstFound = true;
						break;
					}

				const varName = getVariableName(instructions, i);
				if (nonConstFound === false) {
					if (varName !== undefined)
						result.push(varName);
					else
						return undefined;
				}
				else if (varName !== undefined) {
					excludedNames.add(varName);
				}
		}
	}
	return result.filter(varName => excludedNames.has(varName) === false);
};