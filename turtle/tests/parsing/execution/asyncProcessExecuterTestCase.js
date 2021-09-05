import { asyncCheckMessages } from './asyncCheckMessages.js';
import { compile } from '../../../modules/parsing/compile.js';
import { compileCase } from './compileCase.js';
import { compileOptionsArray } from './compileOptionsArray.js';
import { createPrintCountTestTurtle } from '../../helpers/parsing/createPrintCountTestTurtle.js';
import { LogoProgramExecuter } from '../../../modules/parsing/execution/LogoProgramExecuter.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { validateProgram } from '../../helpers/parsing/validateProgram.js';

export async function asyncProcessExecuterTestCase(caseInfo, index, logger) {
	const info = compileCase(caseInfo, index, logger);
	if (info === undefined)
		return;
	compileOptionsArray.forEach(async function(compileOptions) {
		const program = compile(caseInfo.code, info.tree, info.testLogger, undefined, compileOptions, new Map());
		const prefixLogger = prefixWrapper('Failed with code ' + caseInfo.code + ', index ' + index + ', compileOptions: ' + JSON.stringify(compileOptions), info.plogger);
		if (validateProgram(program, prefixLogger))
			return; // no need to continue testing with these compile options because error already found.
		let turtleInfo = createPrintCountTestTurtle();
		const executer = new LogoProgramExecuter(turtleInfo.turtle, program);
		executer.addEventListener('exception', function(e) {
			console.error(e);
			prefixLogger(`exception thrown. e=${e.details}`);
		});
		let problemFound = await asyncCheckMessages(executer, turtleInfo, caseInfo, prefixLogger);
		if (!problemFound) {
			turtleInfo = createPrintCountTestTurtle();
			executer.turtle = turtleInfo.turtle;
			executer.restart();
			problemFound = await asyncCheckMessages(executer, turtleInfo, caseInfo, prefixLogger);
		}
		if (problemFound) {
			prefixLogger('program instructions = ' + JSON.stringify(program.instructions.map(i => i.toDTO())));
		}
	});
};