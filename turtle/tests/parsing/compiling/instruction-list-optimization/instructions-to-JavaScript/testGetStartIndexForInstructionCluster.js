import { getStartIndexForInstructionCluster } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/getStartIndexForInstructionCluster.js';
import { instructionsDTOToInstructions } from '../../../../helpers/instructionsDTOToInstructions.js';
import { getMandelbrotProceduresMap } from './testConvertInstructionsToJavaScriptForMandelbrot.js';

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

export function testGetStartIndexForInstructionCluster(logger) {
	const cases = [
		{'in': 0, 'out': 0},
		{'in': 4, 'out': 2},
		{'in': 7, 'out': 5},
		{'in': 10, 'out': 0},
		{'in': 16, 'out': 13},
		{'in': 17, 'out': 12},
		{'in': 21, 'out': 19},
		{'in': 27, 'out': 26}
	];
	cases.forEach(function(caseInfo, index) {
		const result = getStartIndexForInstructionCluster(instructions, caseInfo.in);
		if (result !== caseInfo.out)
			logger(`Case ${index}.  index=${caseInfo.in}  Expected result of ${caseInfo.out} but got ${result}`);
	});
};