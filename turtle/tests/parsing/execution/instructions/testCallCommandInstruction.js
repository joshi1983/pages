import { CallCommandInstruction } from
'../../../../modules/parsing/execution/instructions/CallCommandInstruction.js';
import { createRootToken } from
'../../../helpers/createRootToken.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';

export function testCallCommandInstruction(logger) {
	const cases = [
		{'commandName': 'penUp', 'numArgs': 0, 'skipValidationAndSanitization': true},
		{'commandName': 'penDown', 'numArgs': 0, 'skipValidationAndSanitization': true}
	];
	const token = createRootToken();
	cases.forEach(function(dto, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const instruction = CallCommandInstruction.createFromDTO(dto, token);
		if (!(instruction instanceof CallCommandInstruction))
			plogger(`Expected an instance of CallCommandInstruction but instruction = ${instruction}`);
		else {
			if (instruction.numArgs !== dto.numArgs)
				plogger(`Expected numArgs to be ${dto.numArgs} but found ${instruction.numArgs}`);
			if (instruction.command.primaryName !== dto.commandName)
				plogger(`Expected command.primaryName to be ${dto.commandName} but found ${instruction.command.primaryName}`);
			if (instruction.skipValidationAndSanitization !== dto.skipValidationAndSanitization)
				plogger(`Expected skipValidationAndSanitization to be ${dto.skipValidationAndSanitization} but found ${instruction.skipValidationAndSanitization}`);
		}
	});
};