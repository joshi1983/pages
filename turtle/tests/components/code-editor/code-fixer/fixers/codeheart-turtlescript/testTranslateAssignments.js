import { processTranslateTestCases } from './processTranslateTestCases.js';

export function testTranslateAssignments(logger) {
	const cases = [
		{'in': 'x = 123', 'out': 'make "x 123'},
		{'in': '++x', 'out': 'make "x :x + 1'},
		{'in': '--x', 'out': 'make "x :x - 1'},
		{'in': 'x++', 'out': 'make "x :x + 1'},
		{'in': 'x--', 'out': 'make "x :x - 1'},
		{'in': 'x = !y;', 'out': 'make "x not :y'},
		{'in': 'x += 123', 'out': 'make "x :x + 123'},
		{'in': 'x -= 123', 'out': 'make "x :x - 123'},
		{'in': 'x = Math.random();', 'out': 'make "x randomRatio'},
		{'in': 'x = Math.abs(-4);', 'out': 'make "x abs -4'},
		{'in': 'x = Math.sin(-4);', 'out': 'make "x radSin -4'},
		{'in': 'x = Math.PI;', 'out': 'make "x pi'},
		{'in': 'x = Math.SQRT2;', 'out': 'make "x 1.4142135623730951'},
		{'in': 'var x = 2;', 'out': 'make "x 2'},
	];
	processTranslateTestCases(cases, logger);
};