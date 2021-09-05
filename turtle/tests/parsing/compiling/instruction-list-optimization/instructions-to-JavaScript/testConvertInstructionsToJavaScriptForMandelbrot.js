import { convertInstructionsToJavaScript } from '../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/convertInstructionsToJavaScript.js';
import { DeepEquality } from '../../../../../modules/DeepEquality.js';
import { instructionsDTOToInstructions } from '../../../../helpers/instructionsDTOToInstructions.js';
import { ParseTreeToken } from '../../../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { Procedure } from '../../../../../modules/parsing/Procedure.js';

const mandelbrotInstructionsDTO = [
	{"name":"push","value":0,"isCloningValue":false}, // index 0
	{"name":"call-cmd","commandName":"setPenSize","numArgs":1}, // 1
	{"name":"pop"}, // 2
	{"name":"push","value":"x","isCloningValue":false}, // 3
	{"name":"push","value":-100,"isCloningValue":false}, // 4
	{"name":"push","value":100,"isCloningValue":false}, // 5
	{"name":"push","value":1,"isCloningValue":false}, // 6
	{"name":"push-for-count"}, // 7
	{"name":"push","value":"y","isCloningValue":false}, // 8
	{"name":"push","value":-100,"isCloningValue":false}, // 9
	{"name":"push","value":100,"isCloningValue":false}, // 10
	{"name":"push","value":1,"isCloningValue":false}, // 11
	{"name":"push-for-count"}, // 12
	{"name":"push","value":"v","isCloningValue":false}, // 13
	{"name":"push","value":10,"isCloningValue":false}, // 14
	{"name":"read-variable","variableName":"x"}, // 15
	{"name":"push","value":0.01,"isCloningValue":false},
	{"name":"binary-operator","symbol":"*"},
	{"name":"read-variable","variableName":"y"},
	{"name":"push","value":0.01,"isCloningValue":false},
	{"name":"binary-operator","symbol":"*"},
	{"name":"call-proc","procName":"getmandelbrotvalue"},
	{"name":"binary-operator","symbol":"*"},
	{"name":"call-cmd","commandName":"make","numArgs":2},
	{"name":"pop"},
	{"name":"push","value":"c","isCloningValue":false},
	{"name":"read-variable","variableName":"v"},
	{"name":"read-variable","variableName":"v"},
	{"name":"read-variable","variableName":"v"},
	{"name":"call-cmd","commandName":"list","numArgs":3},
	{"name":"call-cmd","commandName":"make","numArgs":2},
	{"name":"pop"},
	{"name":"read-variable","variableName":"x"},
	{"name":"read-variable","variableName":"y"},
	{"name":"call-cmd","commandName":"setXY","numArgs":2},
	{"name":"pop"},
	{"name":"read-variable","variableName":"c"},
	{"name":"call-cmd","commandName":"setFillColor","numArgs":1},
	{"name":"pop"},
	{"name":"push","value":1.42,"isCloningValue":false},
	{"name":"call-cmd","commandName":"circle","numArgs":1},
	{"name":"pop"},
	{"name":"increment-for-counter"},
	{"name":"jump-if-true","newIndex":13},
	{"name":"pop-for-count"},
	{"name":"increment-for-counter"},
	{"name":"jump-if-true","newIndex":8},
	{"name":"pop-for-count"}
];
const expectedResultDTO = [
	{"name":"javascript","code": "context.turtle.setPenSize(0)"},
	{"name":"javascript","code":"context.valueStack.push(\"x\",-100,100,1)"}
];

const proceduresMap = getMandelbrotProceduresMap();
const instructions = instructionsDTOToInstructions(mandelbrotInstructionsDTO, proceduresMap);

export function getMandelbrotProceduresMap() {
	const proceduresMap = new Map();
	const getmandelbrotvalueNameToken = new ParseTreeToken('getMandelbrotValue', null, 0, 0, ParseTreeTokenType.LEAF);
	proceduresMap.set('getmandelbrotvalue', new Procedure('getmandelbrotvalue', ['x', 'y'], getmandelbrotvalueNameToken));
	return proceduresMap;
}

export function testConvertInstructionsToJavaScriptForMandelbrot(logger) {
	const expectedResult = instructionsDTOToInstructions(expectedResultDTO, proceduresMap);
	const instructions2 = instructions.slice(0); // clone so the original instructions array is left unchanged for other tests.
	convertInstructionsToJavaScript(instructions2, [], true, {});
	for (let i = 0; i < expectedResult.length; i++) {
		const actual = instructions2[i].toDTO();
		const expected = expectedResult[i].toDTO();
		if (!DeepEquality.equals(actual, expected))
			logger('Mismatch at instruction index ' + i + '.  Expected ' + JSON.stringify(expected) + ' but got ' + JSON.stringify(actual));
	}
};