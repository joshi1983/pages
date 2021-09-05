import { translateKojoToWebLogo } from
'../../../../modules/parsing/kojo/translation-to-weblogo/translateKojoToWebLogo.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testTranslateRepeatFor(logger) {
	const cases = [
		{
			'in': 'repeatFor(5)',
			// weird case.  This likely isn't valid Kojo code but
			// there is a really clear intention with the code so we'll test for it anyway.
			'outContains': 'repeat 5 ['
		},
		{
			'in': 'repeatFor(1 to 6)',
			'outContains': 'for [ "i 1 6 ] ['
		},
		{
			'in': 'repeatFor(x to y)',
			'outContains': 'for [ "i :x :y ] ['
		},
		{
			'in': 'repeatFor(x to y by step)',
			'outContains': 'for [ "i :x :y :step ] ['
		},
		{
			'in': 'repeatFor(x to y by step) { z => println(z)}',
			'outContains': 'for [ "z :x :y :step ] ['
		},
		{
			'in': 'repeatFor(100 to 400 by 100) {',
			'outContains': 'for [ "i 100 400 100 ] ['
		}
	];
	testInOutPairs(cases, translateKojoToWebLogo, logger);
};