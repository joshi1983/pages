import { convertInstructionsToJavaScript } from
'../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/convertInstructionsToJavaScript.js';
import { createTestTurtle } from '../../../../helpers/createTestTurtle.js';
import { instructionsDTOToInstructions } from
'../../../../helpers/instructionsDTOToInstructions.js';
import { JavaScriptInstruction } from
'../../../../../modules/parsing/execution/instructions/JavaScriptInstruction.js';
import { getMandelbrotProceduresMap } from './testConvertInstructionsToJavaScriptForMandelbrot.js';
import { LogoProgram } from
'../../../../../modules/parsing/execution/LogoProgram.js';
import { LogoProgramExecuter } from
'../../../../../modules/parsing/execution/LogoProgramExecuter.js';
import { stringifyExceptionDetails } from
'../../../../helpers/stringifyExceptionDetails.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

function testIfElseExprConversion(logger) {
	const proceduresMap = new Map();
	const instructionsDTO = [
		{'name': 'read-variable', 'variableName': 'x'},
		{'name': 'push', 'value': 1, 'isCloningValue': false},
		{'name': 'binary-operator', 'symbol': '>'},
		{'name': 'jump-if-true', 'newIndex': 6},
		{'name': 'push', 'value': 2, 'isCloningValue': false},
		{'name': 'jump', 'newIndex': 7},
		{'name': 'push', 'value': 3, 'isCloningValue': false},
		{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1},
		{'name': 'pop'},
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO, new Map());
	convertInstructionsToJavaScript(instructions, [], false, {});
	if (instructions.length !== 7)
		logger(`Expected 7 instructions but got ${instructions.length}`);
	else if (!(instructions[0] instanceof JavaScriptInstruction))
		logger(`Expected a JavaScriptInstruction but got ${instructions[0]}`);
}

/*
Similar test cases are found in:
parsing/execution/testLogoProgramExecuterIfElse.js.

The following focuses more on convertInstructionsToJavaScript, though.
The execution folder tests are less focused in this specific unit under test.
*/
function testIfElse2ExprConversion(logger) {
	/*This test case simulates the optimization of WebLogo code like this:*/
	const code = `make "radius 1
repeat 2 [
	make "gap :radius * ifelse (even? repcount) 0.5 0.4
	print :gap
]`;
	const instructionsDTO = [
		/*0*/{'name': 'push', 'value': 'radius', 'isCloningValue': false},
		/*1*/{'name': 'push', 'value': 1, 'isCloningValue': false},
		/*2*/{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2},
		/*3*/{'name': 'pop'},
		/*4*/{'name': 'push', 'value': 2, 'isCloningValue': false},
		/*5*/{'name': 'push-max-repcount', 'value': 2, 'isCloningValue': false},
		/*6*/{'name': 'push', 'value': 'gap', 'isCloningValue': false},
		/*7*/{'name': 'read-variable', 'variableName': 'radius'},
		/*8*/{'name': 'call-cmd', 'commandName': 'repcount', 'numArgs': 0},
		/*9*/{'name': 'call-cmd', 'commandName': 'evenp', 'numArgs': 1},
		/*10*/{'name': 'jump-if-true', 'newIndex': 13},
		/*11*/{'name': 'push', 'value': 0.4, 'isCloningValue': false},
		/*12*/{'name': 'jump', 'newIndex': 14},
		/*13*/{'name': 'push', 'value': 0.5, 'isCloningValue': false},
		/*14*/{'name': 'binary-operator', 'symbol': '*'},
		/*15*/{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2},
		/*16*/{'name': 'pop'},
		/*17*/{'name': 'read-variable', 'variableName': 'gap'},
		/*18*/{'name': 'call-cmd', 'commandName': 'print', 'numArgs': 1},
		/*19*/{'name': 'pop'},
		/*20*/{'name': 'increment-repcount'},
		/*21*/{'name': 'jump-if-true', 'newIndex': 6},
		/*22*/{'name': 'pop-repcount'}
	];
	const proceduresMap = new Map();
	const instructions = instructionsDTOToInstructions(instructionsDTO, new Map());
	convertInstructionsToJavaScript(instructions, [], false, {});
	const mockParseTree = instructions[0].parseTreeToken;
	const program = new LogoProgram(code, mockParseTree, proceduresMap, instructions);
	const turtle = createTestTurtle({
		'print': function(msg) {
			messages.push(msg);
		}
	});
	const messages = [];
	const executer = new LogoProgramExecuter(turtle, program);
	executer.addEventListener('exception', function(e) {
		logger(`An exception was thrown while executing the test program.  The exception is ${stringifyExceptionDetails(e.details)}`);
	});
	executer.executeInstructionsSync(200);
	const expectedMessages = ['0.4', '0.5'];
	if (messages.length !== expectedMessages.length)
		logger(`Expected ${expectedMessages.length} messages printed but found ${messages.length}`);
	for (let i = 0; i < expectedMessages.length; i++) {
		if (messages[i] !== expectedMessages[i])
			logger(`Expected messages[${i}] to be ${expectedMessages[i]} but got ${messages[i]}`);
	}
}

function testMakeConversion(logger) {
	const instructionsDTO = [
		{"name":"push","value":"x", 'isCloningValue': false},
		{"name":"push","value":10, 'isCloningValue': false},
		{"name":"call-cmd","commandName": "make", "numArgs": 2},
		{"name":"pop"},
	];
	const instructions = instructionsDTOToInstructions(instructionsDTO, new Map());
	convertInstructionsToJavaScript(instructions, [], false, {});
	if (instructions.length !== 1)
		logger(`Expected 1 instruction but got ${instructions.length}`);
	else if (!(instructions[0] instanceof JavaScriptInstruction))
		logger(`Expected a JavaScriptInstruction but got ${instructions[0]}`);
}

const instructionsDTO = [
	{"name":"push","value":"v","isCloningValue":false}, // 0
	{"name":"push","value":10,"isCloningValue":false}, // 1
	{"name":"read-variable","variableName":"x"}, // 2
	{"name":"push","value":0.01,"isCloningValue":false}, // 3
	{"name":"binary-operator","symbol":"*"}, // 4
	{"name":"read-variable","variableName":"y"}, // 5
	{"name":"push","value":0.01,"isCloningValue":false}, // 6
	{"name":"binary-operator","symbol":"*"}, // 7
	{"name":"call-proc","procName":"getmandelbrotvalue"}, // 8
	{"name":"binary-operator","symbol":"*"}, // 9
	{"name":"call-cmd","commandName":"make","numArgs":2}, // 10
	{"name":"pop"}, // 11
	{"name":"push","value":"c","isCloningValue":false}, // 12
	{"name":"read-variable","variableName":"v"}, // 13
	{"name":"read-variable","variableName":"v"}, // 14
	{"name":"read-variable","variableName":"v"}, // 15
	{"name":"call-cmd","commandName":"list","numArgs":3}, // 16
	{"name":"call-cmd","commandName":"make","numArgs":2}, // 17
	{"name":"pop"}, // 18
	{"name":"read-variable","variableName":"x"}, // 19
	{"name":"read-variable","variableName":"y"}, // 20
	{"name":"call-cmd","commandName":"setXY","numArgs":2}, // 21
	{"name":"pop"}, // 22
	{"name":"read-variable","variableName":"c"}, // 23
	{"name":"call-cmd","commandName":"setFillColor","numArgs":1}, // 24
	{"name":"pop"}, // 25
	{"name":"push","value":1.42,"isCloningValue":false}, // 26
	{"name":"call-cmd","commandName":"circle","numArgs":1}, // 27
	{"name":"pop"}
];
const proceduresMap = getMandelbrotProceduresMap();
const instructions = instructionsDTOToInstructions(instructionsDTO, proceduresMap);

function testMandelbrotConversion1() {
	convertInstructionsToJavaScript(instructions, [], false, {});
}

export function testConvertInstructionsToJavaScript(logger) {
	wrapAndCall([
		testIfElseExprConversion,
		testIfElse2ExprConversion,
		testMandelbrotConversion1,
		testMakeConversion
	], logger);
};