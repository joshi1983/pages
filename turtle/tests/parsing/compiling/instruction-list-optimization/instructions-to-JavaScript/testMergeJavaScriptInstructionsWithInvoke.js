import { createRootToken } from '../../../../helpers/createRootToken.js';
import { createTestTurtle } from '../../../../helpers/createTestTurtle.js';
import { DeepEquality } from '../../../../../modules/DeepEquality.js';
import { instructionsDTOToInstructions } from '../../../../helpers/instructionsDTOToInstructions.js';
import { LogoProgram } from '../../../../../modules/parsing/execution/LogoProgram.js';
import { LogoProgramExecuter } from '../../../../../modules/parsing/execution/LogoProgramExecuter.js';
import { mergeJavaScriptInstructions } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/mergeJavaScriptInstructions.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { simplifyInstructions } from '../../../../../modules/parsing/compiling/instruction-list-optimization/simplifyInstructions.js';

const code = `make "result []
make "vals [2 3]
repeat 2 [
	   make "val item repcount :vals
	   queue2 "result (invoke "sum :val 2)
]`;

const instructionsDTO = [
	// make "result []
	{'name': 'push', 'value': 'result', 'isCloningValue': false},
	{'name': 'push', 'value': [], 'isCloningValue': true},
	{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2},
	{'name': 'pop'},

	// make "vals [2 3]
	{'name': 'push', 'value': 'vals', 'isCloningValue': false},
	{'name': 'push', 'value': [2, 3], 'isCloningValue': true},
	{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2},
	{'name': 'pop'},

	// repeat 2 [
	{'name': 'push', 'value': 2, 'isCloningValue': false},
	{'name': 'push-max-repcount'},

	// make "val item repcount :vals
	{'name': 'push', 'value': 'val', 'isCloningValue': false},
	{'name': 'call-cmd', 'commandName': 'repcount', 'numArgs': 0},
	{'name': 'read-variable', 'variableName': 'vals'},
	{'name': 'call-cmd', 'commandName': 'item', 'numArgs': 2},
	{'name': 'call-cmd', 'commandName': 'make', 'numArgs': 2},
	{'name': 'pop'},

	// queue2 "result (invoke "sum :val 2)
	{'name': 'push', 'value': 'result', 'isCloningValue': false},
	{'name': 'read-variable', 'variableName': 'val'},
	{'name': 'push', 'value': 2, 'isCloningValue': false},
	{'name': 'push', 'value': 'sum', 'isCloningValue': false},
	{'name': 'call-high-order', 'numArgs': 2},
	{'name': 'call-cmd', 'commandName': 'queue2', 'numArgs': 2},
	{'name': 'pop'},

	{'name': 'increment-repcount'},
	{'name': 'jump-if-true', 'newIndex': 10},
	// ] ; end of repeat-loop.
	{'name': 'pop-repcount'}
];
const proceduresMap = new Map();

function instructionsToProgram(instructions) {
	const tree = createRootToken();
	return new LogoProgram(code, tree, proceduresMap, instructions);
}

function checkPostConditions(executer, logger) {
	const context = executer.executionContext;
	if (context.valueStack.length !== 0)
		logger(`valueStack expected to be initially empty but found ${context.valueStack.length} elements in valueStack.`);
	if (context.globalVariables.size !== 0)
		logger(`Expected there to be 0 globalVariables but got ${context.globalVariables.size}`);
	executer.addEventListener('exception', function(e) {
		console.error(e.details);
		logger('An exception happened: ' + e.details.e.message);
	});
	executer.executeInstructionsSync(500); // execute the whole program.
	const variables = executer.executionContext.globalVariables;
	if (!variables.has('val'))
		logger('Expected to have a global variable named val but did not find it');
	else if (variables.get('val') !== 3)
		logger(`Expected val to be 3 but got ${variables.get('val')}`);
	if (!variables.has('result'))
		logger('Expected to have a global variable named result but did not find it');
	else if (!variables.get('result') instanceof Array)
		logger('Expected global variable result to be an Array but got ' + variables.get('result'));
	else if (variables.get('result').length !== 2)
		logger(`Expected result.length to be 2 but got ${variables.get('result').length}. result = ${JSON.stringify(variables.get('result'))}`);
	else {
		const expected = [4, 5];
		const result = variables.get('result');
		for (let i = 0; i < 2; i++) {
			if (expected[i] !== result[i])
				logger(`Expected [${i}] to be ${expected[i]} but got ${result[i]}`);
		}
	}
}

function testInstructionsDTO(logger, instructionsDTO) {
	const instructions = instructionsDTOToInstructions(instructionsDTO, proceduresMap);
	const program = instructionsToProgram(instructions);
	const turtle = createTestTurtle();
	const executer = new LogoProgramExecuter(turtle, program);
	checkPostConditions(executer, logger);
}

function testMergeJavaScriptInstructions(logger) {
	const instructions = instructionsDTOToInstructions(instructionsDTO, proceduresMap);
	mergeJavaScriptInstructions(instructions);
	const program = instructionsToProgram(instructions);
	const turtle = createTestTurtle();
	const executer = new LogoProgramExecuter(turtle, program);
	checkPostConditions(executer, logger);
}

function testSimplify(compileOptions, logger) {
	const instructions = instructionsDTOToInstructions(instructionsDTO, proceduresMap);
	simplifyInstructions(instructions, [], false, compileOptions);
	const program = instructionsToProgram(instructions);
	const turtle = createTestTurtle();
	const executer = new LogoProgramExecuter(turtle, program);
	checkPostConditions(executer, logger);
}

function testSimplifyNoTranslate(logger) {
	const compileOptions = {'translateToJavaScript': false};
	testSimplify(compileOptions, logger);
}

function testTranslateToJavaScript(logger) {
	const compileOptions = {'translateToJavaScript': true};
	testSimplify(compileOptions, logger);
}

export function testMergeJavaScriptInstructionsWithInvoke(logger) {
	testInstructionsDTO(prefixWrapper('testInstructionsDTO', logger), instructionsDTO);
	testMergeJavaScriptInstructions(prefixWrapper('testMergeJavaScriptInstructions', logger));
	testSimplifyNoTranslate(prefixWrapper('testSimplifyNoTranslate', logger));
	testTranslateToJavaScript(prefixWrapper('testTranslateToJavaScript', logger));
};