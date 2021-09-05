import { flatten } from '../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { CallCommandInstruction } from '../../../modules/parsing/execution/instructions/CallCommandInstruction.js';
import { JavaScriptInstruction } from '../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';
import { parse } from '../../../modules/parsing/js-parsing/parse.js';
import { removeUnneededCurvedBrackets } from
'../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/removeUnneededCurvedBrackets.js';

function isJavaScriptEqual(code1, code2) {
	const parseResult1 = parse(code1);
	const parseResult2 = parse(code2);
	const tokens1 = flatten(parseResult1.root);
	const tokens2 = flatten(parseResult2.root);
	if (tokens1.length !== tokens2.length)
		return false;
	for (let i = 0; i < tokens1.length; i++) {
		const tok1 = tokens1[i];
		const tok2 = tokens2[i];
		if (tok1.val !== tok2.val)
			return false;
		if (tok1.type !== tok2.type)
			return false;
	}
	return true;
}

function validateJavaScriptInstruction(instruction, logger) {
	// check that instruction.code is in instruction.execute.
	const code = instruction.code;
	const s = instruction.execute.toString();
	const firstBracketIndex = s.indexOf('{');
	const lastBracketIndex = s.lastIndexOf('}');
	const implementation = s.substring(firstBracketIndex + 1, lastBracketIndex);
	if (!isJavaScriptEqual(removeUnneededCurvedBrackets(implementation), removeUnneededCurvedBrackets(code))) {
		logger(`Expected to find code in execute but did not.  code=${code}.  execute.toString()=${s}, implementation=${implementation}`);
		return true;
	}
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
	let errorFound = validateInstructionsArray(program.instructions, logger);
	for (const [name, procedure] of program.procedures.entries()) {
		if (validateInstructionsArray(procedure.instructions, logger))
			errorFound = true;
	}
	return errorFound;
};