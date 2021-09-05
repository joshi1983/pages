import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translateProcessingToWebLogo } from
'../../../../modules/parsing/processing/translation-to-weblogo/translateProcessingToWebLogo.js';

export function testTranslateFor(logger) {
	const cases = [
		{'in': 'for (int i = 0; i < 10; i++) {}',
		'out': 'repeat 10 [\n]'},
		{'in': 'for (int i = 0; i < 100; i++) {}',
		'out': 'repeat 100 [\n]'},
		{'in': 'for (int i = 0; i < limit; i++) {}',
		'out': 'repeat :limit [\n]'},
		{'in': 'for (int i = 1; i < limit; i++) {}',
		'out': 'repeat :limit - 1 [\n]'},
		{'in': 'for (int i = 1; i < 100; i++) {f(i);}',
		'out': 'repeat 99 [\n\t( f repcount )\n]'},
		{'in': 'for (int i = 0; i <= limit; i++) {f(i);}',
		'out': 'for [ "i 0 :limit ] [\n\t( f :i )\n]'},
		{'in': 'for (int i = 0; i <= limit; i+=2) {f(i);}',
		'out': 'for [ "i 0 :limit 2 ] [\n\t( f :i )\n]'},
		{'in': 'for (int i = 0; i >= limit; i--) {f(i);}',
		'out': 'for [ "i 0 :limit -1 ] [\n\t( f :i )\n]'},
		{'in': 'for (int x = 0; x < 3; x++) { println(x); }',
		'out': 'for [ "x 0 2 ] [\n\tprint :x\n]'},
		{'in': 'for (int x = 1; x <= 3; x++) { println(x); } println(100 + x)',
		'out': 'repeat 3 [\n\tprint repcount\n]\nmake "x 4\nprint 100 + :x'},
		{'in': 'for (; i >= limit;) {}',
		'out': 'while :i >= :limit [\n]'},
		{'in': 'for (; i > limit;) {}',
		'out': 'while :i > :limit [\n]'},
		{'in': 'for (; f(i) > limit;) {}',
		'out': 'while ( f :i ) > :limit [\n]'},
	];
	testInOutPairs(cases, translateProcessingToWebLogo, logger);
};