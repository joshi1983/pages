import { CallHighOrderInstruction } from '../../../../modules/parsing/execution/instructions/CallHighOrderInstruction.js';
import { createRootToken } from '../../../helpers/createRootToken.js';
import { createTestTurtle } from '../../../helpers/createTestTurtle.js';
import { ExecutionContext } from '../../../../modules/parsing/execution/ExecutionContext.js';
import { LogoProgramExecuter } from '../../../../modules/parsing/execution/LogoProgramExecuter.js';
import { testCodeToProgram } from '../../../helpers/testCodeToProgram.js';
import { Turtle } from '../../../../modules/command-groups/Turtle.js';
import { Vector2DDrawing } from '../../../../modules/drawing/vector/Vector2DDrawing.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';
const rootToken = createRootToken();
const instruction = new CallHighOrderInstruction(1, rootToken);
const turtle = createTestTurtle();

function testRunningCommand(logger) {
	const program = testCodeToProgram('', logger);
	const instruction = new CallHighOrderInstruction(2, rootToken);
	const context = new ExecutionContext(turtle, program);
	// test running a command.
	context.valueStack.push(2);
	context.valueStack.push(3);
	context.valueStack.push("sum");
	instruction.execute(context);
	if (context.valueStack.length !== 1)
		logger(`Expected valueStack.length to be 1 but got ${context.valueStack.length}`);
	else {
		const val = context.valueStack[0];
		if (val !== 5)
			logger(`Expected val to be 5 but got "${val}"`);
	}
}

function testRunningProcedure(logger) {
	const program = testCodeToProgram('to p :val\nprint :val\nend', logger);
	let msg;
	const settings = {
		'animation.time': 0,
		'animation.duration': 10,
		'print': function(_msg) {
			msg = _msg;
		}
	};
	const drawing = new Vector2DDrawing();
	const runProcTurtle = new Turtle(settings, drawing);
	const context = new ExecutionContext(runProcTurtle, program);
	// test running a command.
	context.valueStack.push("y");
	context.valueStack.push("p");
	instruction.execute(context);
	const executer = new LogoProgramExecuter(runProcTurtle, program);
	executer.executionContext = context;
	executer.executeInstructionsSync(100); // execute enough to finish the procedure.
	if (msg !== 'y')
		logger(`Expected msg to be "y" but got "${msg}"`);
}

export function testCallHighOrderInstruction(logger) {
	wrapAndCall([
		testRunningCommand,
		testRunningProcedure
	], logger);
};