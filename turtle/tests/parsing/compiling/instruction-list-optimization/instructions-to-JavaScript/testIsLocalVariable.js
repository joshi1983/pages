import { instructionsDTOToInstructions } from '../../../../helpers/instructionsDTOToInstructions.js';
import { isLocalVariable } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/isLocalVariable.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';

function processTestCase(caseInfo, index, instructions, logger) {
	const result = isLocalVariable(caseInfo.var, caseInfo.index, instructions, true, caseInfo.parameters);
	if (result !== caseInfo.result)
		logger(`Case ${index} failed. index=${caseInfo.index}, parameters=${caseInfo.parameters}, var=${caseInfo.var}.  Expected ${caseInfo.result} but got ${result}`);
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
		{'index': 0, 'parameters': [], 'var': 'x', 'result': false},
		{'index': 0, 'parameters': ['x'], 'var': 'x', 'result': true},
		{'index': 2, 'parameters': [], 'var': 'x', 'result': false},
		{'index': 3, 'parameters': [], 'var': 'x', 'result': true},
		{'index': 3, 'parameters': [], 'var': 'y', 'result': false},
		{'index': 6, 'parameters': [], 'var': 'y', 'result': false},
		{'index': 10, 'parameters': [], 'var': 'y', 'result': true},
		{'index': 11, 'parameters': [], 'var': 'x', 'result': true},
		{'index': 14, 'parameters': [], 'var': 'x', 'result': true},
		{'index': 0, 'parameters': [], 'var': 'x', 'result': false}
	];
	cases.forEach(function(caseInfo, index) {
		processTestCase(caseInfo, index, instructions, logger);
	});
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
		{'index': 0, 'parameters': [], 'var': 'x', 'result': false},
		{'index': 1, 'parameters': [], 'var': 'x', 'result': false},
		{'index': 9, 'parameters': [], 'var': 'x', 'result': undefined},
		{'index': 16, 'parameters': [], 'var': 'x', 'result': true},
		{'index': 23, 'parameters': [], 'var': 'x', 'result': true},
	];
	cases.forEach(function(caseInfo, index) {
		processTestCase(caseInfo, index, instructions, logger);
	});
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
	const cases = [
		{'index': 0, 'parameters': [], 'var': 'x', 'result': false},
		{'index': 1, 'parameters': [], 'var': 'x', 'result': false},
		{'index': 9, 'parameters': [], 'var': 'x', 'result': undefined},
		{'index': 18, 'parameters': [], 'var': 'x', 'result': true},
	];
	cases.forEach(function(caseInfo, index) {
		processTestCase(caseInfo, index, instructions, logger);
	});
}

export function testIsLocalVariable(logger) {
	testAssignValueAfterRead(prefixWrapper('testAssignValueAfterRead', logger));
	testAssignValueAfterReadUsingJavaScript(prefixWrapper('testAssignValueAfterReadUsingJavaScript', logger));
	testSimulatedForLoop(prefixWrapper('testSimulatedForLoop', logger));
};