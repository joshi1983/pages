import { CallCommandInstruction } from '../../../modules/parsing/execution/instructions/CallCommandInstruction.js';

function validateCallCommandInstruction(instruction, logger) {
	let errorFound = false;
	for (let i = 0; i < instruction.converters.length; i++) {
		if (typeof instruction.converters[i] !== 'function') {
			logger(`All converters on a CallCommandInstruction must be functions but found: ${instruction.converters[i]} at index ${i}`);
			errorFound = true;
		}
	}
	return errorFound;
}

function validateInstructionsArray(instructions, logger) {
	let errorFound = false;
	for (let i = 0; i < instructions.length; i++) {
		const instruction = instructions[i];
		if (instruction instanceof CallCommandInstruction) {
			if (validateCallCommandInstruction(instruction, logger))
				errorFound = true;
		}
	}
	return errorFound;
}

export function validateProgram(program, logger) {
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function but got ${logger}`);
	let errorFound = validateInstructionsArray(program.instructions, logger);
	for (const [name, procedure] of program.procedures.entries()) {
		if (validateInstructionsArray(procedure.instructions, logger))
			errorFound = true;
	}
	return errorFound;
};