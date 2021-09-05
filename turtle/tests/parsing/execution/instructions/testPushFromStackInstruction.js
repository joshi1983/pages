import { createRootToken } from
'../../../helpers/createRootToken.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { PushFromStackInstruction } from
'../../../../modules/parsing/execution/instructions/PushFromStackInstruction.js';

export function testPushFromStackInstruction(logger) {
	const cases = [
		{'numToPush': 1},
		{'numToPush': 2}
	];
	const token = createRootToken();
	cases.forEach(function(dto, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const instruction = PushFromStackInstruction.createFromDTO(dto, token);
		if (!(instruction instanceof PushFromStackInstruction))
			plogger(`Expected an instance of PushFromStackInstruction but instruction = ${instruction}`);
		else {
			if (instruction.numToPush !== dto.numToPush)
				plogger(`Expected numToPush to be ${dto.numToPush} but found ${instruction.numToPush}`);
		}
	});
};