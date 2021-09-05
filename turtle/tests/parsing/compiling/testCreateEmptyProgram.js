import { createEmptyProgram } from '../../../modules/parsing/compiling/createEmptyProgram.js';
import { LogoProgram } from '../../../modules/parsing/execution/LogoProgram.js';

export function testCreateEmptyProgram(logger) {
	const program = createEmptyProgram();
	if (!(program instanceof LogoProgram))
		logger(`Expected a LogoProgram but got ${program}`);
};