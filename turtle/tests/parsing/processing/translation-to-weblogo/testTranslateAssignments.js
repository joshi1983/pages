import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/processing/translation-to-weblogo/translate.js';

export function testTranslateAssignments(logger) {
	const cases = [
		{'in': 'x += 2;', 'out': 'make "x :x + 2'},
		{'in': 'x -= 2;', 'out': 'make "x :x - 2'},
		{'in': 'x *= 2;', 'out': 'make "x :x * 2'},
		{'in': 'x /= 2;', 'out': 'make "x :x / 2'},
		{'in': 'x %= 2;', 'out': 'make "x modulo :x 2'},
		// %= isn't mentioned 
		
		/*{'in': 'x--;', 'out': 'make "x :x - 1'},
		{'in': 'x++;', 'out': 'make "x :x + 1'},*/
		{'in': '--x;', 'out': 'make "x :x - 1'},
		{'in': '++x;', 'out': 'make "x :x + 1'},
	];
	testInOutPairs(cases, translate, logger);
};