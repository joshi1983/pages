/*
This isn't short.

It is complicated to correctly verify all cases where variables are set and not modified so there is a lot of code here.

Replacing variable reads with pushes of the constant value doesn't save much time but this
could lead to further simplifications of constant expressions that do significantly improve performance.
*/

import { CallCommandInstruction } from '../../execution/instructions/CallCommandInstruction.js';
import { getVariableName } from './getVariableName.js';
import { getVariablesAssignedAConstant } from './getVariablesAssignedAConstant.js';
import { mutatingCommandsArray } from '../../parse-tree-analysis/variable-data-types/isMutationCommand.js';
import { PushForCountInstruction } from '../../execution/instructions/PushForCountInstruction.js';
import { PushInstruction } from '../../execution/instructions/PushInstruction.js';
import { removeInstructions } from './removeInstructions.js';
import { shouldValueBeCloned } from '../shouldValueBeCloned.js';
import { VariableReadInstruction } from '../../execution/instructions/VariableReadInstruction.js';
const mutationCommandNames = mutatingCommandsArray.filter(name => ['localmake', 'make'].indexOf(name) === -1);

// Tries to find all the for-loop variables.
// Succeeds in the simplest cases where there are no for-loops in the instruction list or constants are given to each.
// Returns undefined otherwise to indicate that we don't know what the for-loop variable names are.
function getVariableNamesSetUsingFor(instructions) {
	const result = [];
	for (let i = 4; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction instanceof PushForCountInstruction) {
			for (let j = 1; j <= 4; j++) {
				const instruction2 = instructions[i - j];
				if (!(instruction2 instanceof PushInstruction)) {
					return undefined;
				}
			}
			result.push(instructions[i - 4].value);
		}
	}
	return result;
}

function getConstantValue(instructions, constantName) {
	for (let i = 2; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction instanceof CallCommandInstruction &&
		instruction.command.primaryName === 'localmake' &&
		instructions[i - 1] instanceof PushInstruction &&
		instructions[i - 2] instanceof PushInstruction &&
		instructions[i - 2].value === constantName)
			return instructions[i - 1].value;
	}
}

function getVariablesModifiedByCommand(instructions, primaryName) {
	if (typeof primaryName !== 'string')
		throw new Error('primaryName must be a string');

	const result = [];
	for (let i = 2; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction instanceof CallCommandInstruction &&
			instruction.command.primaryName === primaryName) {
			const varName = getVariableName(instructions, i);
			if (typeof varName === 'string')
				result.push(varName);
		}
	}
	return result;
}

/*
The list of commands that might modify a variable could become hard to maintain here.
*/
function getVariablesModifiedBySpecialCommands(instructions) {
	const variableGroups = mutationCommandNames.map(name => getVariablesModifiedByCommand(instructions, name));
	const result = [];
	for (let i = 0; i < variableGroups.length; i++) {
		const varGroup = variableGroups[i];
		if (varGroup === undefined)
			return undefined;
		for (let j = 0; j < varGroup.length; j++) {
			result.push(varGroup[j]);
		}
	}
	return result;
}

// Note that some variables could be read before assigned and also not get returned here.
// This simple approach of tracing through the instructions from top to bottom
// should work most of the time, though.
function getVariablesLikelyReadBeforeAssigned(instructions) {
	let result = new Set();
	let varNamesSet = new Set();
	for (let i = 0; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction instanceof CallCommandInstruction) {
			const primaryName = instruction.command.primaryName;
			if ((primaryName === 'localmake' || primaryName === 'make') &&
			i > 1 && instructions[i - 2] instanceof PushInstruction) {
				varNamesSet.add(instructions[i - 2].value);
			}
		}
		else if (instruction instanceof VariableReadInstruction && !varNamesSet.has(instruction.variableName)) {
			result.add(instruction.variableName);
		}
	}
	return Array.from(result);
}

export function substituteLocalConstants(instructions, parameters) {
	const makeVariableNames = getVariablesModifiedByCommand(instructions, 'make');
	const localMakeVariableNames = getVariablesAssignedAConstant(instructions);
	const forVariableNames = getVariableNamesSetUsingFor(instructions);
	const variablesLikelyReadBeforeAssigned = getVariablesLikelyReadBeforeAssigned(instructions);
	const variablesModifiedBySpecialCommands = getVariablesModifiedBySpecialCommands(instructions);
	if (variablesModifiedBySpecialCommands !== undefined && makeVariableNames !== undefined && localMakeVariableNames !== undefined &&
	forVariableNames !== undefined) {
		const constantNames = localMakeVariableNames.filter(
			localVarName => parameters.indexOf(localVarName) === -1 &&
			makeVariableNames.indexOf(localVarName) === -1 &&
			forVariableNames.indexOf(localVarName) === -1 &&
			variablesLikelyReadBeforeAssigned.indexOf(localVarName) === -1 &&
			variablesModifiedBySpecialCommands.indexOf(localVarName) === -1 &&
			localMakeVariableNames.filter(L2 => L2 === localVarName).length === 1);
		for (let i = 0; i < constantNames.length; i++) {
			const constantName = constantNames[i];
			const constantValue = getConstantValue(instructions, constantName);
			if (constantValue === undefined) {
				console.error('Internal error. constant value is unexpectedly undefined.');
				return; // give up.
			}
			for (let j = 0; j < instructions.length; j++) {
				const instruction = instructions[j];
				if (instruction instanceof VariableReadInstruction &&
				instruction.variableName === constantName) {
					/*
					Replace variable read instruction with a push since we know what the value will always be constantValue.
					*/
					instructions[j] = new PushInstruction(constantValue, instruction.parseTreeToken, shouldValueBeCloned(constantValue));
				}
				else if (instruction instanceof CallCommandInstruction && instruction.command.primaryName === 'localmake' &&
				instructions[j - 1] instanceof PushInstruction &&
				instructions[j - 2] instanceof PushInstruction &&
				instructions[j - 2].value === constantName) {
					/*
					Remove the instructions that assign a value to that variable since we don't need them anymore.
					*/
					removeInstructions(instructions, j - 2, 4); 
					// 4 to include 2 pushes, calling localmake and a pop of its null result.
					j -= 3;
				}
			}
		}
	}
};