import { createRootToken } from
'../../../helpers/createRootToken.js';
import { IncrementForCounterInstruction } from
'../../../../modules/parsing/execution/instructions/IncrementForCounterInstruction.js';

export function testIncrementForCounterInstruction(logger) {
	const dto = {};
	const token = createRootToken();
	const instruction = IncrementForCounterInstruction.createFromDTO(dto, token);
	if (!(instruction instanceof IncrementForCounterInstruction))
		logger(`Expected an instance of IncrementForCounterInstruction but instruction = ${instruction}`);
};