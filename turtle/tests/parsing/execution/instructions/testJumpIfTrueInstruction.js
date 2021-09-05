import { createRootToken } from
'../../../helpers/createRootToken.js';
import { JumpIfTrueInstruction } from
'../../../../modules/parsing/execution/instructions/JumpIfTrueInstruction.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';

export function testJumpIfTrueInstruction(logger) {
	const cases = [
		{'newIndex': 0},
		{'newIndex': 1}
	];
	const token = createRootToken();
	cases.forEach(function(dto, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const instruction = JumpIfTrueInstruction.createFromDTO(dto, token);
		if (!(instruction instanceof JumpIfTrueInstruction))
			plogger(`Expected an instance of JumpIfTrueInstruction but instruction = ${instruction}`);
		else {
			if (instruction.jumpToIndex !== dto.newIndex)
				plogger(`Expected jumpToIndex to be ${dto.newIndex} but found ${instruction.jumpToIndex}`);
		}
	});
};