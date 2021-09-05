import { callCommandInstructionToJavaScript } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/callCommandInstructionToJavaScript.js';
import { instructionsDTOToInstructions } from '../../../../helpers/instructionsDTOToInstructions.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

function testUsingPrint(logger) {
	const instructionsDTO = [
		{'name': 'push', 'value': 5, 'isCloningValue': false},
		{'name': 'push', 'value': 19, 'isCloningValue': false},
		{'name': 'binary-operator', 'symbol': '+'},
		{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1},
		{'name': 'pop'}
	];
	const compileOptions = {};
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	const wrapResult = callCommandInstructionToJavaScript(instructions, 3, {'isForProcedure': false, 'parameters': []}, false, compileOptions);
	const code = wrapResult.code;
	const expected = 'context.turtle.print(5 + 19)';
	if (code !== expected)
		logger(`Expected "${expected}"`, ` but got "${code}"`);
	const wrapResult2 = callCommandInstructionToJavaScript(instructions, 3, {'isForProcedure': false, 'parameters': []}, true, compileOptions);
	const result2 = wrapResult2.code;
	const expected2 = 'context.valueStack.push(context.turtle.print(5 + 19));';
	if (result2 !== expected2)
		logger(`Expected "${expected2}"`, ` but got "${result2}"`);
}

function testUsingQueue2(logger) {
	const instructionsDTO = [
		{'name': 'push', 'value': 'x', 'isCloningValue': false},
		{'name': 'push', 'value': [], 'isCloningValue': true},
		{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2},
		{'name': 'pop'},
		{'name': 'push', 'value': 'x', 'isCloningValue': false},
		{'name': 'push', 'value': 19, 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'queue2', 'numArgs': 2},
		{'name': 'pop'}
	];
	const compileOptions = {};
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	const wrapResult = callCommandInstructionToJavaScript(instructions, 2,
		{'isForProcedure': false, 'parameters': []},
		false,
		compileOptions);
	const result = wrapResult.code;
	const expected = 'context.make("x",[])';
	if (result !== expected)
		logger(`Expected "${expected}" but got "${result}"`);
	const wrapResult2 = callCommandInstructionToJavaScript(instructions, 6, {'isForProcedure': false, 'parameters': []}, false, compileOptions);
	const result2 = wrapResult2.code;
	const expected2 = 'context.list.queue2(this.validateListVariableReference("x", context),19)';
	if (result2 !== expected2)
		logger(`Expected "${expected2}"`, ` but got "${result2}"`);
}

export function testCallCommandInstructionToJavaScript(logger) {
	wrapAndCall([
		testUsingPrint,
		testUsingQueue2
	], logger);
};