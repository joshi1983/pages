import { createRootToken } from
'../../../helpers/createRootToken.js';
import { OutputInstruction } from
'../../../../modules/parsing/execution/instructions/OutputInstruction.js';

export function testOutputInstruction(logger) {
	const dto = {};
	const token = createRootToken();
	const instruction = OutputInstruction.createFromDTO(dto, token);
	if (!(instruction instanceof OutputInstruction))
		logger(`Expected an instance of OutputInstruction but instruction = ${instruction}`);
};