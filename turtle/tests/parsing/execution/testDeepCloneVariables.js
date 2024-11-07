import { createTestTurtle } from '../../helpers/createTestTurtle.js';
import { deepCloneVariables } from '../../../modules/parsing/execution/deepCloneVariables.js';
import { LogoProgramExecuter } from '../../../modules/parsing/execution/LogoProgramExecuter.js';
import { testCodeToProgram } from '../../helpers/testCodeToProgram.js';

export function testDeepCloneVariables(logger) {
	const code = `make "a 4
make "b "hi
make "c 'hello world'
make "d []
make "e ["hi 1 'hello world']
make "colorStops createPList
setProperty "colorStops 0 "red
setProperty "colorStops 1 "green
make "g createRadialGradient pos 100 :colorStops
make "h true
make "i false
make "j transparent`;
	const turtle = createTestTurtle();
	const compileOptions = {
		'translateToJavaScript': true,
		'mergeJavaScriptInstructions': true
	};
	const program = testCodeToProgram(code, logger, compileOptions);
	const executer = new LogoProgramExecuter(turtle, program);
	executer.executeInstructionsSync(1000);
	const original = executer.executionContext.globalVariables;
	const result = deepCloneVariables(original);

	// simulate mutations after the clone to see if the changes are correctly not affecting the clone.
	original.set('a', 5);
	original.set('x', 123);

	if (!(result instanceof Map))
		logger(`result expected to be a Map but got ${result}`);
	else if (result.size !== 10)
		logger(`result.size expected to be 10 but got ${result.size}`);
	else if (result.get('x') !== undefined)
		logger(`result.get('x') expected to be undefined but got ${result.get('x')}`);
	else if (result.get('a') !== 4)
		logger(`result.get('a') expected to be 4 but got ${result.get('a')}`);
};