import { createRootToken } from
'../../../helpers/createRootToken.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { VariableReadInstruction } from
'../../../../modules/parsing/execution/instructions/VariableReadInstruction.js';

export function testVariableReadInstruction(logger) {
	const cases = [
		{'variableName': 'x'},
		{'variableName': 'y'}
	];
	const token = createRootToken();
	cases.forEach(function(dto, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const instruction = VariableReadInstruction.createFromDTO(dto, token);
		if (!(instruction instanceof VariableReadInstruction))
			plogger(`Expected an instance of VariableReadInstruction but instruction = ${instruction}`);
		else {
			if (instruction.variableName !== dto.variableName)
				plogger(`Expected variableName to be ${dto.variableName} but found ${instruction.variableName}`);
		}
	});
};