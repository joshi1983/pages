import { createRootToken } from
'../../../helpers/createRootToken.js';
import { OutputNullInstruction } from
'../../../../modules/parsing/execution/instructions/OutputNullInstruction.js';

export function testOutputNullInstruction(logger) {
	const dto = {};
	const token = createRootToken();
	const instruction = OutputNullInstruction.createFromDTO(dto, token);
	if (!(instruction instanceof OutputNullInstruction))
		logger(`Expected an instance of OutputNullInstruction but instruction = ${instruction}`);
};