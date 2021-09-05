import { createRootToken } from
'../../../helpers/createRootToken.js';
import { PushMaxRepcountInstruction } from
'../../../../modules/parsing/execution/instructions/PushMaxRepcountInstruction.js';

export function testPushMaxRepcountInstruction(logger) {
	const dto = {};
	const token = createRootToken();
	const instruction = PushMaxRepcountInstruction.createFromDTO(dto, token);
	if (!(instruction instanceof PushMaxRepcountInstruction))
		logger(`Expected an instance of PushMaxRepcountInstruction but instruction = ${instruction}`);
};