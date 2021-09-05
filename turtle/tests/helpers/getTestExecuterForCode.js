import { createTestTurtle } from './createTestTurtle.js';
import { testCodeToProgram } from './testCodeToProgram.js';
import { LogoProgramExecuter } from '../../modules/parsing/execution/LogoProgramExecuter.js';

export function getTestExecuterForCode(code, logger, compileOptions, optionalSettings, analyzeCodeQuality) {
	if (analyzeCodeQuality === undefined)
		analyzeCodeQuality = true;
	const program = testCodeToProgram(code, logger, compileOptions, analyzeCodeQuality);
	if (program === undefined)
		return;
	const turtle = createTestTurtle(optionalSettings);
	return new LogoProgramExecuter(turtle, program);
};