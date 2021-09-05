import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { isLikelyASMTurtle } from '../../../modules/parsing/asm-turtle/isLikelyASMTurtle.js';
import { processingExamples } from '../../helpers/parsing/processingExamples.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, processingExamples);

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
	nonExamples.forEach(function(content) {
		cases.push({'in': content, 'out': false});
	});
	testInOutPairs(cases, isLikelyASMTurtle, logger);
};