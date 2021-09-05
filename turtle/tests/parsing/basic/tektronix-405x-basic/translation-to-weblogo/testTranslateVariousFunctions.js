import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateTektronix405XBasicToWebLogo } from
'../../../../../modules/parsing/basic/tektronix-405x-basic/translation-to-weblogo/translateTektronix405XBasicToWebLogo.js';

export function testTranslateVariousFunctions(logger) {
	const cases = [
		{'in': 'print "hi"', 'out': 'print "hi'},
		{'in': 'SET DEGREES\nrotate 45', 'out': 'setHeading -45'},
		//{'in': 'SET DEGREES\nx=3\nrotate x', 'out': 'make "x 3\nsetHeading -:x'}
	];
	testInOutPairs(cases, translateTektronix405XBasicToWebLogo, logger);
};