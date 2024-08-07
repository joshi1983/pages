import { checkMessages } from './checkMessages.js';
import { compile } from '../../../modules/parsing/compile.js';
import { compileCase } from './compileCase.js';
import { compileOptionsArray } from './compileOptionsArray.js';
import { createPrintCountTestTurtle } from '../../helpers/parsing/createPrintCountTestTurtle.js';
import { LogoProgramExecuter } from '../../../modules/parsing/execution/LogoProgramExecuter.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { validateProgram } from '../../helpers/parsing/validateProgram.js';
import { validateVector2DDrawing } from '../../helpers/drawing/vector/validateVector2DDrawing.js';

function stringifyExceptionDetails(details) {
	if (typeof details === 'object') {
		if (typeof details.e === 'object' && typeof details.e.message === 'string')
			return details.e.message;
	}
	return '' + details;
}

export function processExecuterTestCase(caseInfo, index, logger) {
	const info = compileCase(caseInfo, index, logger);
	if (info === undefined)
		return;
	compileOptionsArray.forEach(function(compileOptions) {
		const program = compile(caseInfo.code, info.tree, info.testLogger, undefined, compileOptions, new Map());
		const prefixLogger = prefixWrapper('Failed with code ' + caseInfo.code + ', index ' + index + ', compileOptions: ' + JSON.stringify(compileOptions), info.plogger);
		if (validateProgram(program, prefixLogger))
			return; // no need to continue testing with these compile options because error already found.
		let turtleInfo = createPrintCountTestTurtle();
		const executer = new LogoProgramExecuter(turtleInfo.turtle, program);
		executer.addEventListener('exception', function(e) {
			console.error(e);
			prefixLogger(`exception thrown. e=${stringifyExceptionDetails(e.details)}`);
		});
		let problemFound = checkMessages(executer, turtleInfo, caseInfo, prefixLogger);
		if (!problemFound) {
			turtleInfo = createPrintCountTestTurtle();
			executer.turtle = turtleInfo.turtle;
			executer.restart();
			problemFound = checkMessages(executer, turtleInfo, caseInfo, prefixLogger);
		}
		if (problemFound) {
			prefixLogger('program instructions = ' + JSON.stringify(program.instructions.map(i => i.toDTO())));
		}
		validateVector2DDrawing(executer.turtle.drawing, prefixWrapper(`drawing`, prefixLogger));
	});
};