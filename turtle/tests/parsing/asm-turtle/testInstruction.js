import { Instruction } from '../../../modules/parsing/asm-turtle/Instruction.js';

export function testInstruction(logger) {
	const testNames = ['cmp', 'CMP', 'fd', 'Fd'];
	testNames.forEach(function(name) {
		const info = Instruction.getInstructionInfo(name);
		if (typeof info !== 'object')
			logger(`Expected to find an object for instruction name ${name} but got ${info}`);
	});
};