import { CallCommandInstruction } from '../../execution/instructions/CallCommandInstruction.js';
import { CallHighOrderInstruction } from '../../execution/instructions/CallHighOrderInstruction.js';
import { getVariableNames } from './getVariableNames.js';
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
				for (let j = 1; j <= instruction.numArgs; j++) {
					const instruction_ = instructions[i - j];
					if ((!(instruction_ instanceof PushInstruction)) ||
					instruction_.value instanceof Array) {
						nonConstFound = true;
						break;
					}
				}

				const varNames = getVariableNames(instructions, i);
				for (const varName of varNames) {
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
	}
	return result.filter(varName => excludedNames.has(varName) === false);
};