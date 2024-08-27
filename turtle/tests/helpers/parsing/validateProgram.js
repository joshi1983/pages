import { flatten } from '../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { CallCommandInstruction } from '../../../modules/parsing/execution/instructions/CallCommandInstruction.js';
import { JavaScriptInstruction } from '../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';

function validateJavaScriptInstruction(instruction, logger) {
	// check that instruction.code is in instruction.execute.
	const code = instruction.code;
	const s = instruction.execute.toString();
	const firstBracketIndex = s.indexOf('{');
	const lastBracketIndex = s.lastIndexOf('}');
	const implementation = s.substring(firstBracketIndex + 1, lastBracketIndex);
	return false;
}

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
		else if (instruction instanceof JavaScriptInstruction) {
			if (validateJavaScriptInstruction(instruction, logger))
				errorFound = true;
		}
	}
	return errorFound;
}

export function validateProgram(program, logger) {
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function but got ${logger}`);
	if (!(program.instructions instanceof Array))
		throw new Error(`program.instructions must be an Array but got ${program.instructions}`);
	let errorFound = validateInstructionsArray(program.instructions, logger);
	for (const [name, procedure] of program.procedures.entries()) {
		if (typeof procedure !== 'object')
			throw new Error(`procedure must be an object but got ${procedure}`);
		if (!(procedure.instructions instanceof Array))
			throw new Error(`Expected procedure.instructions to be an Array but got ${procedure.instructions}`);
		if (validateInstructionsArray(procedure.instructions, logger))
			errorFound = true;
	}
	return errorFound;
};