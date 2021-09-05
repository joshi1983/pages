import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateAmosBasicToWebLogo } from
'../../../../../modules/parsing/basic/amos-basic/translation-to-weblogo/translateAmosBasicToWebLogo.js';

export function testTranslateAmosBasicToWebLogo(logger) {
	const cases = [
		{'in': 'curs off', 'out': ''},
		{'in': 'Fade 5', 'out': ''},
		{'in': 'flash off', 'out': ''},
		{'in': 'print "hi"', 'out': 'print "hi'},
		{'in': 'add x,1', 'out': 'make "x :x + 1'}
	];
	testInOutPairs(cases, translateAmosBasicToWebLogo, logger);
};