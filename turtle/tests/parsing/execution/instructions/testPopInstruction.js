import { createRootToken } from
'../../../helpers/createRootToken.js';
import { PopInstruction } from
'../../../../modules/parsing/execution/instructions/PopInstruction.js';

export function testPopInstruction(logger) {
	const dto = {};
	const token = createRootToken();
	const instruction = PopInstruction.createFromDTO(dto, token);
	if (!(instruction instanceof PopInstruction))
		logger(`Expected an instance of PopInstruction but instruction = ${instruction}`);
};