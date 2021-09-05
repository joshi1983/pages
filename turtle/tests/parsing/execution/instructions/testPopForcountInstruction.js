import { createRootToken } from
'../../../helpers/createRootToken.js';
import { PopForcountInstruction } from
'../../../../modules/parsing/execution/instructions/PopForcountInstruction.js';

export function testPopForcountInstruction(logger) {
	const dto = {};
	const token = createRootToken();
	const instruction = PopForcountInstruction.createFromDTO(dto, token);
	if (!(instruction instanceof PopForcountInstruction))
		logger(`Expected an instance of PopForcountInstruction but instruction = ${instruction}`);
};