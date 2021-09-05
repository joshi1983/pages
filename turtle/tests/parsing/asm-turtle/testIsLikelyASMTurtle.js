import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { asmTurtleExamples } from '../../helpers/parsing/asmTurtleExamples.js';
import { isLikelyASMTurtle } from '../../../modules/parsing/asm-turtle/isLikelyASMTurtle.js';
import { kturtleExampleFiles } from '../../helpers/parsing/kturtleExampleFiles.js';
import { logo3DExamples } from '../../helpers/parsing/logo3DExamples.js';
import { papertExamples } from '../../helpers/parsing/papertExamples.js';
import { povRayExamples } from '../../helpers/parsing/povRayExamples.js';
import { pythonTurtleExampleFilesContent } from '../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { sonicWebTurtleExamples } from
'../../helpers/parsing/sonicWebTurtleExamples.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, kturtleExampleFiles);
ArrayUtils.pushAll(nonExamples, logo3DExamples);
ArrayUtils.pushAll(nonExamples, papertExamples);
ArrayUtils.pushAll(nonExamples, povRayExamples);
ArrayUtils.pushAll(nonExamples, pythonTurtleExampleFilesContent);
ArrayUtils.pushAll(nonExamples, sonicWebTurtleExamples);

export function testIsLikelyASMTurtle(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'fd 100', 'out': false},
	{'in': 'instr\nrepeat 3 [ fd 1]', 'out': false}, 
	// repeat should never be in an ASM Turtle program.

	{'in': 'instr\nfd 100\nsetPenColor 3', 'out': false},
	{'in': 'instr\nfd 100\nsetPenSize 3', 'out': false},
	{'in': 'instr\nfd 100', 'out': true},
	{'in': 'var\nx\n\n// setPenSize 3\ninstr', 'out': true},
	// The commented setPenSize should not affect the result of isLikelyASMTurtle.

	{'in': 'instr\nproc @@proc1:\nret', 'out': true},
	{'in': 'var\n\ninstr\nfd 100', 'out': true},
	{'in': 'var\nx\ninstr\nfd 100', 'out': true},
	{'in': 'var\nx\ninstr\nsaveto x\nfd x', 'out': true},
	{'in': '@@start:\nfd 100', 'out': true},
	{'in': '@@start:\nfd 100\njmp @start', 'out': true},
	{'in': '@@start:', 'out': true},
	];
	asmTurtleExamples.forEach(function(content) {
		cases.push({'in': content, 'out': true});
	});
	nonExamples.forEach(function(content) {
		cases.push({'in': content, 'out': false});
	});
	testInOutPairs(cases, isLikelyASMTurtle, logger);
};