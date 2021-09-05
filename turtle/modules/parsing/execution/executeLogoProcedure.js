import { Breakpoint } from './Breakpoint.js';
import { ExecutingProcedure } from './ExecutingProcedure.js';
import { LogoProgram } from './LogoProgram.js';
import { LogoProgramExecuter } from './LogoProgramExecuter.js';
import { Turtle } from '../../command-groups/Turtle.js';
import { Vector2DDrawing } from '../../drawing/vector/Vector2DDrawing.js';

/*
Asyncronously returns the result of the specified procedure, if successful.

maxInstructions represents a time limit for the procedure.  It is optional and defaulted to 1000.
*/
export function executeLogoProcedure(program, procName, maxInstructions, settingOverrides) {
	if (!(program instanceof LogoProgram))
		throw new Error('program must be a LogoProgram');
	if (typeof procName !== 'string')
		throw new Error('procName must be a string.  Not: ' + procName);
	if (maxInstructions === undefined)
		maxInstructions = 1000;
	else if (typeof maxInstructions !== 'number')
		throw new Error('maxInstructions must either be undefined or a number');
	if (typeof settingOverrides !== 'object')
		settingOverrides = {};

	procName = procName.toLowerCase();
	if (!program.procedures.has(procName))
		throw new Error('Program has no procedure named ' + procName);
	const proc = program.procedures.get(procName);
	if (proc.parameters.length !== 0)
		throw new Error('Can only execute procedures with no parameters.  parameters length = ' + proc.parameters.length);

	const drawing = new Vector2DDrawing();
	const settings = {
		'animationTime': 0,
		'animationDurationSeconds': 10
	};
	Object.assign(settings, settingOverrides);
	const turtle = new Turtle(settings, drawing);
	return new Promise(function(resolve, reject) {
		let t;
		const executer = new LogoProgramExecuter(turtle, program);
		executer.executionContext.procedureStack.push(new ExecutingProcedure(proc, -1, 0, 0, 0));
		function stopInterval() {
			if (t !== undefined) {
				clearInterval(t);
				t = undefined;
				executer.pauseContinuousExecution();
				return true;
			}
			return false;
		}
		executer.addEventListener('breakpoint', function() {
			if (stopInterval()) {
				const vStack = executer.executionContext.valueStack;
				resolve(vStack[vStack.length - 1]);
			}
		});
		executer.addBreakpoint(new Breakpoint(-1, undefined, function() {
			return true;
		}));
		executer.addEventListener('execution-stopped', function() {
			if (stopInterval())
				reject({'msg': 'Execution stopped before reaching the breakpoint'});
		});
		executer.addEventListener('exception', function(event) {
			if (stopInterval())
				reject({'msg': 'Exception', 'details': event.details});
		});
		function checkExecutionLimit() {
			if (executer.instructionExecutionCount > maxInstructions) {
				console.log(`checkExecutionLimit() called.  ${executer.instructionExecutionCount} > ${maxInstructions}`);
				stopInterval();
				reject({
					'msg': 'excution limit exceeded',
					'maxInstructions': maxInstructions,
					'instructionExecutionCount': executer.instructionExecutionCount
				});
			}
		}
		t = setInterval(checkExecutionLimit, 100);
		executer.startContinuousExecution();
	});
};