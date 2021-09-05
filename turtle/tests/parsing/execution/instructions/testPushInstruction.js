import { createRootToken } from
'../../../helpers/createRootToken.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { PushInstruction } from
'../../../../modules/parsing/execution/instructions/PushInstruction.js';

export function testPushInstruction(logger) {
	const cases = [
		{'value': 1, 'isCloningValue': false},
		{'value': 2, 'isCloningValue': false}
	];
	const token = createRootToken();
	cases.forEach(function(dto, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const instruction = PushInstruction.createFromDTO(dto, token);
		if (!(instruction instanceof PushInstruction))
			plogger(`Expected an instance of PushInstruction but instruction = ${instruction}`);
		else {
			if (instruction.value !== dto.value)
				plogger(`Expected value to be ${dto.value} but found ${instruction.value}`);
			if (instruction.isCloningValue !== dto.isCloningValue)
				plogger(`Expected isCloningValue to be ${dto.isCloningValue} but found ${instruction.isCloningValue}`);
		}
	});
};