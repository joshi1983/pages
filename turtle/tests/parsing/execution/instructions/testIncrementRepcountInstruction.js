import { createRootToken } from
'../../../helpers/createRootToken.js';
import { IncrementRepcountInstruction } from
'../../../../modules/parsing/execution/instructions/IncrementRepcountInstruction.js';

export function testIncrementRepcountInstruction(logger) {
	const dto = {};
	const token = createRootToken();
	const instruction = IncrementRepcountInstruction.createFromDTO(dto, token);
	if (!(instruction instanceof IncrementRepcountInstruction))
		logger(`Expected an instance of IncrementRepcountInstruction but instruction = ${instruction}`);
};