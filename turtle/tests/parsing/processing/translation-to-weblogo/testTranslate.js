import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/processing/translation-to-weblogo/translate.js';

export function testTranslate(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'int x = 2', 'out': 'make "x 2'},
		{'in': 'int[] x = {}', 'out': 'make "x [ ]'},
		{'in': 'int x = PI', 'out': 'make "x pi'},
		{'in': 'println(x.length)', 'out': 'print count :x'},
		{'in': 'println(3)', 'out': 'print 3'},
		{'in': 'println (3)', 'out': 'print 3'},
		{'in': 'println ( 3 )', 'out': 'print 3'},
		{'in': 'printArray(x)', 'out': 'print :x'},
	];
	testInOutPairs(cases, translate, logger);
};