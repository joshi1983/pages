import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/processing/translation-to-weblogo/translate.js';

export function testTranslateDeclarations(logger) {
	const cases = [
		{'in': 'boolean x', 'out': 'make "x false'},
		{'in': 'double x', 'out': 'make "x 0'},
		{'in': 'char x', 'out': 'make "x "'},
		{'in': 'float x', 'out': 'make "x 0'},
		{'in': 'int x', 'out': 'make "x 0'},
		{'in': 'long x', 'out': 'make "x 0'},
		{'in': 'String x', 'out': 'make "x "'},
		{'in': 'boolean[] x', 'out': 'make "x [ ]'},
		{'in': 'int[] x', 'out': 'make "x [ ]'},
		{'in': 'String[] x', 'out': 'make "x [ ]'},
		{'in': 'A[] x', 'out': 'make "x [ ]'},
		{'in': 'int x,y', 'out': 'make "x 0\nmake "y 0'},
		{'in': 'int x = 2', 'out': 'make "x 2'},
		{'in': 'int[] x = {}', 'out': 'make "x [ ]'},
		{'in': 'int x = PI', 'out': 'make "x pi'},
	];
	testInOutPairs(cases, translate, logger);
};