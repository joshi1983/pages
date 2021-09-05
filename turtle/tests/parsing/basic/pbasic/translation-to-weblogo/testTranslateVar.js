import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translatePBasicToWebLogo } from
'../../../../../modules/parsing/basic/pbasic/translation-to-weblogo/translatePBasicToWebLogo.js';

export function testTranslateVar(logger) {
	const cases = [
		{'in': 'var x : Float = 0', 'out': 'make "x 0'},
		{'in': 'var xyz : Int = 3', 'out': 'make "xyz 3'},
		{'in': 'var x : String = "hi"', 'out': 'make "x "hi'},
		{'in': 'var pi: Float = 3', 'out': 'make "pi 3'}
	];
	testInOutPairs(cases, translatePBasicToWebLogo, logger);
};