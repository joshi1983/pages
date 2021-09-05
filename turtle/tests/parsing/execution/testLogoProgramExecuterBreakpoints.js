import { Breakpoint } from '../../../modules/parsing/execution/Breakpoint.js';
import { compile } from '../../../modules/parsing/compile.js';
import { createTestTurtle } from '../../helpers/createTestTurtle.js';
import { ExecutingProcedure } from '../../../modules/parsing/execution/ExecutingProcedure.js';
import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { LogoProgramExecuter } from '../../../modules/parsing/execution/LogoProgramExecuter.js';
import { TestParseLogger } from '../../helpers/TestParseLogger.js';

export function testLogoProgramExecuterBreakpoints(logger) {
	const code = 'to getTwo\noutput 2\nend\n fd 10';
	const parseLogger = new TestParseLogger(logger, code);
	const tree = LogoParser.getParseTree(code, parseLogger, new Map());
	if (parseLogger.hasLoggedErrors()) {
		logger('Unexpected errors while parsing code: ' + code);
	}
	else {
		const turtle = createTestTurtle();
		const program = compile(code, tree, parseLogger, new Map(), {'translateToJavaScript': false}, new Map());
		const executer = new LogoProgramExecuter(turtle, program);
		const b = new Breakpoint(-1, undefined, function() {
			return true;
		});
		executer.addBreakpoint(b);
		if (executer.breakpoints.size !== 1)
			logger('Expected breakpoints size to be 1 but got ' + executer.breakpoints.size);
		if (executer.breakpoints.has(-1) !== true)
			logger('Expected to find a breakpoint bucket at -1 but none found');
		executer.removeBreakpoint(b);
		if (executer.breakpoints.size !== 0)
			logger('After removing the only breakpoint, expected breakpoints size to be 0 but got ' + executer.breakpoints.size);
		executer.addBreakpoint(b);
		let breakpointHit = false;
		executer.addEventListener('breakpoint', function() {
			breakpointHit = true;
		});
		const proc = program.procedures.get('gettwo');
		executer.executionContext.procedureStack.push(new ExecutingProcedure(proc, -1, 0, 0, 0));
		executer.executeInstructionsSync(1000);
		if (breakpointHit !== true)
			logger('Expected to hit breakpoint but did not');
		else if (executer.executionContext.valueStack.length !== 1)
			logger('Expected valueStack to have length 1 but got ' + executer.executionContext.valueStack.length);
		else if (executer.executionContext.valueStack[0] !== 2)
			logger('Expected to get a value from valueStack of 2 but got ' + executer.executionContext.valueStack[0]);
	}
};