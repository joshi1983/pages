import { instructionsDTOToInstructions } from
'../../../../helpers/instructionsDTOToInstructions.js';
import { isBinaryOperatorCluster, processBinaryOperatorCluster } from
'../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/processBinaryOperatorCluster.js';
import { JavaScriptInstruction } from
'../../../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

function testSimpleCase(logger) {
	const instructionsDTO = [
	/*0*/{'name': 'push', 'value': 2, 'isCloningValue': false},
	/*1*/{'name': 'push', 'value': 3, 'isCloningValue': false},
	/*2*/{'name': 'binary-operator', 'symbol': '*'},
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO, new Map());
	const result = isBinaryOperatorCluster(instructions, 2);
	if (result !== true)
		logger(`Expected true but got ${result}`);
	else {
		processBinaryOperatorCluster(instructions, 2);
		if (instructions.length !== 1)
			logger(`Expected 1 instruction but found ${instructions.length}`);
		else {
			const instruction = instructions[0];
			const expectedCode = 'context.valueStack.push(2 * 3);';
			if (!(instruction instanceof JavaScriptInstruction))
				logger(`Expected a JavaScriptInstruction but got ${instruction}`);
			else if (instruction.code !== expectedCode)
				logger(`Expected code to be ${expectedCode} but got ${instruction.code}`);
		}
	}
}

function testSimulateIfElse(logger) {
	const instructionsDTO = [
	/*0*/{'name': 'jump-if-true', 'newIndex': 3},
	/*1*/{'name': 'push', 'value': 0.4, 'isCloningValue': false},
	/*2*/{'name': 'jump', 'newIndex': 4},
	/*3*/{'name': 'push', 'value': 0.5, 'isCloningValue': false},
	/*4*/{'name': 'binary-operator', 'symbol': '*'},
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO, new Map());
	const result = isBinaryOperatorCluster(instructions, 4);
	if (result !== false)
		logger(`Expected false but got ${result}`);
}

export function testProcessBinaryOperatorCluster(logger) {
	wrapAndCall([
		testSimpleCase,
		testSimulateIfElse
	], logger);
};