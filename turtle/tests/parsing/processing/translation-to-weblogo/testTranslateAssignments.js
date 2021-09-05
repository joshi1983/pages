import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translateProcessingToWebLogo } from
'../../../../modules/parsing/processing/translation-to-weblogo/translateProcessingToWebLogo.js';

export function testTranslateAssignments(logger) {
	const cases = [
		{'in': 'x[0] = 2;', 'out': 'setItem 1 "x 2'},
		{'in': 'x[1] = 2;', 'out': 'setItem 2 "x 2'},
		{'in': 'x += 2;', 'out': 'make "x :x + 2'},
		{'in': 'x -= 2;', 'out': 'make "x :x - 2'},
		{'in': 'x *= 2;', 'out': 'make "x :x * 2'},
		{'in': 'x /= 2;', 'out': 'make "x :x / 2'},
		{'in': 'x %= 2;', 'out': 'make "x modulo :x 2'},
		// %= isn't mentioned at https://processing.org/reference/
		// it seemed simple enough to support and likely enough to get 
		// added to the language that I wanted to test for it anyway.

		{'in': 'x--;', 'out': 'make "x :x - 1'},
		{'in': 'x++;', 'out': 'make "x :x + 1'},
		{'in': '--x;', 'out': 'make "x :x - 1'},
		{'in': '++x;', 'out': 'make "x :x + 1'},

		{'in': 'this.x++;', 'out': 'setProperty "this "x ( getProperty "this "x ) + 1'},
		{'in': 'this.x--;', 'out': 'setProperty "this "x ( getProperty "this "x ) - 1'},
		{'in': 'this.x += 2;', 'out': 'setProperty "this "x ( getProperty "this "x ) + 2'},
		{'in': 'x += y[3];', 'out': 'make "x :x + ( item 4 :y )'},
		{'in': 'x += y.z;', 'out': 'make "x :x + ( getProperty "y "z )'},
		{'in': 'x += this.z;', 'out': 'make "x :x + ( getProperty "this "z )'},
		{'in': `float angle1 = 0.0;
float angle2 = 0.0;`, 'out': `make "angle1 0.0
make "angle2 0.0`},
		{'in': 'int[] x = new int[10]', 'out': 'make "x [ ]'},
		{'in': 'int[][] x = new int[10][100]', 'out': 'make "x [ ]'}
	];
	testInOutPairs(cases, translateProcessingToWebLogo, logger);
};