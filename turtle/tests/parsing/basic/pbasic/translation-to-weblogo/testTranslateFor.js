import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translatePBasicToWebLogo } from
'../../../../../modules/parsing/basic/pbasic/translation-to-weblogo/translatePBasicToWebLogo.js';

export function testTranslateFor(logger) {
	const cases = [
		{'in': `for z = 1 to 10
	print "hi"
next z`,
		'out': `repeat 10 [
	print "hi
]`},
		{'in': `for z = 1 to 10 step 0.5
	print "hi"
next z`,
		'out': `for [ "z 1 10 0.5 ] [
	print "hi
]`},
	];
	testInOutPairs(cases, translatePBasicToWebLogo, logger);
};