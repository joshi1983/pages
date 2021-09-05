import { createRootToken } from
'../../../helpers/createRootToken.js';
import { JumpInstruction } from
'../../../../modules/parsing/execution/instructions/JumpInstruction.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';

export function testJumpInstruction(logger) {
	const cases = [
		{'newIndex': 0},
		{'newIndex': 1}
	];
	const token = createRootToken();
	cases.forEach(function(dto, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const instruction = JumpInstruction.createFromDTO(dto, token);
		if (!(instruction instanceof JumpInstruction))
			plogger(`Expected an instance of JumpInstruction but instruction = ${instruction}`);
		else {
			if (instruction.jumpToIndex !== dto.newIndex)
				plogger(`Expected jumpToIndex to be ${dto.newIndex} but found ${instruction.jumpToIndex}`);
		}
	});
};