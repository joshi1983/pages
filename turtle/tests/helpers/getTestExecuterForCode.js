import { createTestTurtle } from './createTestTurtle.js';
import { testCodeToProgram } from './testCodeToProgram.js';
import { LogoProgramExecuter } from '../../modules/parsing/execution/LogoProgramExecuter.js';

export function getTestExecuterForCode(code, logger, compileOptions) {
	const program = testCodeToProgram(code, logger, compileOptions);
	const turtle = createTestTurtle();
	return new LogoProgramExecuter(turtle, program);
};