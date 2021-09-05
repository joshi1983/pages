import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translateToWebLogo } from
'../../../../modules/parsing/js-parsing/translation-to-weblogo/translateToWebLogo.js';

export function testTranslateLoops(logger) {
	const cases = [
		{'in': 'while', 'out': 'forever [\n]'},
		{'in': 'while (true)', 'out': 'forever [\n]'},
		{'in': 'while (true) {}', 'out': 'forever [\n]'},
		{'in': 'while (1 < z) {}', 'out': 'while 1 < :z [\n]'},
		{'in': 'while (1 === z) {console.log(z);}', 'out': 'while 1 = :z [\n\tprint :z\n]'},
		{'in': 'do {} while(true)', 'out': 'forever [\n]'},
		{'in': 'do {} while(x < 100)', 'out': 'do.while [\n] :x < 100'},
		{'in': 'do {console.log(4);} while(x < 100)', 'out': 'do.while [\n\tprint 4\n] :x < 100'},
		{'in': 'for (var s = 0; s <= 60; ++s) {}', 'out': 'for [ "s 0 60 ] [\n]'},
		{'in': 'repeat (6) {}', 'out': 'repeat 6 [\n]'},
		{'in': 'repeat (6) {console.log("hi");}', 'out': 'repeat 6 [\n\tprint "hi\n]'},
		{'in': 'for (var s = 0; s <= 60; ++s)', 'out': 'for [ "s 0 60 ] [\n]'},
		{'in': 'for (var s = 0; s <= 60; s+=2)', 'out': 'for [ "s 0 60 2 ] [\n]'},
		{'in': 'for (var s = 2; s <= 60; s*=2)', 'out': 'make "s 2\nwhile :s <= 60 [\n\tmake "s :s * 2\n]'},
	];
	testInOutPairs(cases, translateToWebLogo, logger);
};