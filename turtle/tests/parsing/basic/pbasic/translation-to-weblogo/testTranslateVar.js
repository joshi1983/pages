import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translatePBasicToWebLogo } from
'../../../../../modules/parsing/basic/pbasic/translation-to-weblogo/translatePBasicToWebLogo.js';

export function testTranslateVar(logger) {
	const cases = [
		{'in': 'var x : Float = 0', 'out': 'make "x 0'},
		{'in': 'var xyz : Int = 3', 'out': 'make "xyz 3'},
		{'in': 'var x : String = "hi"', 'out': 'make "x "hi'},
		{'in': 'var pi: Float = 2', 'out': 'make "pi 2'},
			// should translate like other variables because
			// 2 is too different from 3.14159265...
			// to be treated as equal.
		{'in': 'var pi: Float = 3.14159265358979', 'out': ''}
			// should be removed because WebLogo's pi command should be used instead.
	];
	testInOutPairs(cases, translatePBasicToWebLogo, logger);
};