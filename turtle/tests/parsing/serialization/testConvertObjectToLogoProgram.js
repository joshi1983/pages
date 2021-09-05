import { convertLogoProgramToSerializableObject } from
'../../../modules/parsing/serialization/convertLogoProgramToSerializableObject.js';
import { convertObjectToLogoProgram } from
'../../../modules/parsing/serialization/convertObjectToLogoProgram.js';
import { LogoProgram } from
'../../../modules/parsing/execution/LogoProgram.js';
import { codeToProgram } from
'./testConvertLogoProgramToSerializableObject.js';

export function testConvertObjectToLogoProgram(logger) {
	const code = 'forward 100';
	const program = codeToProgram(code, logger);
	const programDTO = convertLogoProgramToSerializableObject(program);
	const remadeProgram = convertObjectToLogoProgram(programDTO);
	if (!(remadeProgram instanceof LogoProgram))
		logger(`remadeProgram should be an object but found ${remadeProgram}`);
	else {
		if (remadeProgram.instructions.length !== program.instructions.length)
			logger(`instructions.length expected to be ${program.instructions.length} but found ${remadeProgram.instructions.length}`);
		if (remadeProgram.procedures.size !== program.procedures.size)
			logger(`procedures.size expected to be ${program.procedures.size} but found ${remadeProgram.procedures.size}`);
	}
};