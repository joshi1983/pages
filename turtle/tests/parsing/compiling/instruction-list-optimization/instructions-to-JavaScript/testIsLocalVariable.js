import { instructionsDTOToInstructions } from '../../../../helpers/instructionsDTOToInstructions.js';
import { isLocalmakeInstruction, isLocalVariable } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/isLocalVariable.js';
import { MaybeDecided } from '../../../../../modules/MaybeDecided.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

function processTestCase(caseInfo, index, instructions, logger) {
	const result = isLocalVariable(caseInfo.var, caseInfo.index, instructions, true, caseInfo.parameters);
	if (result !== caseInfo.result)
		logger(`Case ${index} failed. index=${caseInfo.index}, parameters=${caseInfo.parameters}, var=${caseInfo.var}.  Expected ${MaybeDecided.stringify(caseInfo.result)} but got ${MaybeDecided.stringify(result)}`);
}

function processTestCases(cases, instructions, logger) {
	cases.forEach(function(caseInfo, index) {
		processTestCase(caseInfo, index, instructions, logger);
	});
}

function testSimulatedForLoop(logger) {
	/*
	Instructions are similar to the following Logo code:
	
	localmake "x 5
	for ["y 0 5 1] [
		fd 1
	]
	*/
	const instructionsDTO = [
		{'name': 'push', 'value': 'x', 'isCloningValue': false}, // index 0
		{'name': 'push', 'value': 5, 'isCloningValue': false}, // index 1
		{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2}, // index 2
		{'name': 'pop'}, // index 3
		{'name': 'push', 'value': 'y', 'isCloningValue': false}, // index 4
		{'name': 'push', 'value': 0, 'isCloningValue': false}, // index 5
		{'name': 'push', 'value': 5, 'isCloningValue': false}, // index 6
		{'name': 'push', 'value': 1, 'isCloningValue': false}, // index 7
		{'name': 'push-for-count'}, // index 8
		{'name': 'push', 'value': 1, 'isCloningValue': false}, // index 9
		{'name': 'call-cmd', 'commandName': 'forward', 'numArgs': 1}, // index 10
		{'name': 'pop'}, // index 11
		{'name': 'increment-for-counter'}, // index 12
		{'name': 'jump-if-true', 'newIndex': 9}, // index 13
		{'name': 'pop-for-count'} // index 14
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	const cases = [
		{'index': 0, 'parameters': [], 'var': 'x', 'result': MaybeDecided.No},
		{'index': 0, 'parameters': ['x'], 'var': 'x', 'result': MaybeDecided.Yes},
		{'index': 2, 'parameters': [], 'var': 'x', 'result': MaybeDecided.No},
		{'index': 3, 'parameters': [], 'var': 'x', 'result': MaybeDecided.Yes},
		{'index': 3, 'parameters': [], 'var': 'y', 'result': MaybeDecided.No},
		{'index': 6, 'parameters': [], 'var': 'y', 'result': MaybeDecided.No},
		{'index': 10, 'parameters': [], 'var': 'y', 'result': MaybeDecided.Yes},
		{'index': 11, 'parameters': [], 'var': 'x', 'result': MaybeDecided.Yes},
		{'index': 14, 'parameters': [], 'var': 'x', 'result': MaybeDecided.Yes},
		{'index': 0, 'parameters': [], 'var': 'x', 'result': MaybeDecided.No}
	];
	processTestCases(cases, instructions, logger);
}

function testAssignValueAfterRead(logger) {
	/*
	Instructions are similar to the following Logo code:
	
	repeat 2 [
		if repcount = 2 [
			print :x
		]
		if repcount = 1 [
			localmake "x 4
		]
	]
	localmake "x 10
	print :x
	*/
	const instructionsDTO = [
		// Instructions related to: repeat 2 [
		{'name': 'push', 'value': 2, 'isCloningValue': false}, // index 0
		{'name': 'push-max-repcount'}, // index 1

		// Instructions related to: if repcount = 2
		{'name': 'call-cmd', 'commandName': 'repcount', 'numArgs': 0}, // index 2
		{'name': 'push', 'value': 2, 'isCloningValue': false}, // index 3
		{'name': 'binary-operator', 'operatorSymbol': '='}, // index 4
		{'name': 'jump-if-true', 'newIndex': 9}, // index 5
		
		// Instructions related to: print :x
		{'name': 'read-variable', 'variableName': 'x'}, // index 6
		{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1}, // index 7
		{'name': 'pop'}, // index 8

		// Instructions related to: if repcount = 1
		{'name': 'call-cmd', 'commandName': 'repcount', 'numArgs': 0}, // index 9
		{'name': 'push', 'value': 1, 'isCloningValue': false}, // index 10
		{'name': 'binary-operator', 'operatorSymbol': '='}, // index 11
		{'name': 'jump-if-true', 'newIndex': 17}, // index 12

		// Instructions related to: localmake "x 4
		{'name': 'push', 'value': 'x', 'isCloningValue': false}, // index 13
		{'name': 'push', 'value': 4, 'isCloningValue': false}, // index 14
		{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2}, // index 15
		{'name': 'pop'}, // index 16
		
		// instructions related to: ], end of repeat.
		{'name': 'increment-repcount'}, // index 17
		{'name': 'jump-if-true', 'newIndex': 2}, // index 18

		{'name': 'pop-repcount'}, // index 19

		// instructions related to: localmake "x 10
		{'name': 'push', 'value': 'x', 'isCloningValue': false}, // index 20
		{'name': 'push', 'value': 10, 'isCloningValue': false}, // index 21
		{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2}, // index 22
		{'name': 'pop'}, // index 23
		
		// instructions related to: print :x
		{'name': 'read-variable', 'variableName': 'x'}, // index 24
		{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1}, // index 25
		{'name': 'pop'}, // index 26
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	const cases = [
		{'index': 0, 'parameters': [], 'var': 'x', 'result': MaybeDecided.No},
		{'index': 1, 'parameters': [], 'var': 'x', 'result': MaybeDecided.No},
		{'index': 9, 'parameters': [], 'var': 'x', 'result': MaybeDecided.Maybe},
		{'index': 16, 'parameters': [], 'var': 'x', 'result': MaybeDecided.Yes},
		{'index': 23, 'parameters': [], 'var': 'x', 'result': MaybeDecided.Yes},
	];
	processTestCases(cases, instructions, logger);
}

function testAssignValueAfterReadUsingJavaScript(logger) {
	/*
	Instructions are similar to the following Logo code:

	repeat 2 [
		if repcount = 2 [
			print :x
		]
		if repcount = 1 [
			localmake "x 4
		]
	]
	localmake "x 10
	print :x
	*/
	const instructionsDTO = [
		// Instructions related to: repeat 2 [
		{'name': 'push', 'value': 2, 'isCloningValue': false}, // index 0
		{'name': 'push-max-repcount'}, // index 1

		// Instructions related to: if repcount = 2
		{'name': 'call-cmd', 'commandName': 'repcount', 'numArgs': 0}, // index 2
		{'name': 'push', 'value': 2, 'isCloningValue': false}, // index 3
		{'name': 'binary-operator', 'operatorSymbol': '='}, // index 4
		{'name': 'jump-if-true', 'newIndex': 9}, // index 5
		
		// Instructions related to: print :x
		{'name': 'read-variable', 'variableName': 'x'}, // index 6
		{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1}, // index 7
		{'name': 'pop'}, // index 8

		// Instructions related to: if repcount = 1
		{'name': 'call-cmd', 'commandName': 'repcount', 'numArgs': 0}, // index 9
		{'name': 'push', 'value': 1, 'isCloningValue': false}, // index 10
		{'name': 'binary-operator', 'operatorSymbol': '='}, // index 11
		{'name': 'jump-if-true', 'newIndex': 14}, // index 12

		// Instructions related to: localmake "x 4
		{'name': 'javascript', 'code': 'context.localmake(\"x\",4)'}, // index 13
		
		// instructions related to: ], end of repeat.
		{'name': 'increment-repcount'}, // index 14
		{'name': 'jump-if-true', 'newIndex': 2}, // index 15

		{'name': 'pop-repcount'}, // index 16

		// instructions related to: localmake "x 10
		{'name': 'javascript', 'code': 'context.localmake(\"x\",10)'}, // index 17
		
		// instructions related to: print :x
		{'name': 'read-variable', 'variableName': 'x'}, // index 18
		{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1}, // index 19
		{'name': 'pop'}, // index 20
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	const result17 = isLocalmakeInstruction(instructions, 17, 'x');
	if (result17 !== MaybeDecided.Yes)
		logger(`isLocalmakeInstruction(instructions, 17, 'x') should return MaybeDecided.Yes but got ${MaybeDecided.stringify(result17)}`);
	const cases = [
		{'index': 0, 'parameters': [], 'var': 'x', 'result': MaybeDecided.No},
		{'index': 1, 'parameters': [], 'var': 'x', 'result': MaybeDecided.No},
		{'index': 9, 'parameters': [], 'var': 'x', 'result': MaybeDecided.Maybe},
		{'index': 18, 'parameters': [], 'var': 'x', 'result': MaybeDecided.Yes},
	];
	processTestCases(cases, instructions, logger);
}

function testLocalIfElseAssign(logger) {
	/*
	Instructions are similar to the following Logo code:
	repeat 2 [
		localmake "x ifElse even? repcount 0 1
		print :x
	]
	*/
	const instructionsDTO = [
		{'name': 'push', 'value': '2', 'isCloningValue': false}, // index 0
		{'name': 'push-max-repcount'}, // index 1
		{'name': 'push', 'value': 'x', 'isCloningValue': false}, // index 2
		{'name': 'call-cmd', 'commandName': 'repcount', 'numArgs': 0, 'skipValidationAndSanitization': false},
		// index 3
		{'name': 'call-cmd', 'commandName': 'even?', 'numArgs': 1, 'isCloningValue': false}, // index 4
		{'name': 'jump-if-true', 'newIndex': 8}, // index 5
		{'name': 'push', 'value': '0', 'isCloningValue': false}, // index 6
		{'name': 'jump', 'newIndex': 9}, // index 7
		{'name': 'push', 'value': 1, 'isCloningValue': false}, // index 8
		{'name': 'call-cmd', 'commandName': 'localmake', 'numArgs': 2}, // index 9
		{'name': 'pop'}, // index 10
		{'name': 'read-variable', 'variableName': 'x'}, // index 11
		{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1}, // index 12
		{'name': 'pop'}, // index 13
		{'name': 'increment-repcount'}, // index 14
		{'name': 'jump-if-true', 'newIndex': 2}, // index 15
		{'name': 'pop-repcount'}, // index 16
		{'name': 'output-null'}, // index 17
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO);
	const result = isLocalmakeInstruction(instructions, 9, 'x');
	if (result === MaybeDecided.No)
		logger(`x should be local at instruction 9 so MaybeDecided.No is not an expected result from isLocalmakeInstruction(instructions,9,'x')`);
	const cases = [
		{'index': 11, 'parameters': [], 'var': 'x', 'result': MaybeDecided.Maybe},
		// MaybeDecided.Yes would be a better result but Maybe is ok for now.
	];
	processTestCases(cases, instructions, logger);
}

export function testIsLocalVariable(logger) {
	wrapAndCall([
		testAssignValueAfterRead,
		testAssignValueAfterReadUsingJavaScript,
		testLocalIfElseAssign,
		testSimulatedForLoop
	], logger);
};