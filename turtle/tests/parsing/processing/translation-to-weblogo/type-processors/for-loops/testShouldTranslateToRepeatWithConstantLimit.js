import { processForTokenToSimpleValueTest } from
'../processForTokenToSimpleValueTest.js';
import { shouldTranslateToRepeatWithConstantLimit } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/for-loops/shouldTranslateToRepeatWithConstantLimit.js';

export function testShouldTranslateToRepeatWithConstantLimit(logger) {
	const cases = [
		{'in': 'for (;;) {}', 'out': false},
		{'in': 'for (;true;) {}', 'out': false},
		{'in': 'for (;true;x++) {}', 'out': false},
		{'in': 'for (int x;true;x++) {}', 'out': false},
		{'in': 'for (int x=0;true;x++) {}', 'out': false},
		{'in': 'for (int x=0;x<100;p.x++) {}', 'out': false},
		{'in': 'for (int x=0;p.x<100;x++) {}', 'out': false},
		{'in': 'for (p.x=0;x<100;x++) {}', 'out': false},
		{'in': 'for (int x=0;x<100;y++) {}', 'out': false},
		{'in': 'for (int x=0;y<100;x++) {}', 'out': false},
		{'in': 'for (int y=0;x<100;x++) {}', 'out': false},
		{'in': 'for (int x=0;x<100;x++) { point(x, x); }', 'out': false},
		{'in': 'for (int x=1;x>-10;x--) { point(x, x); }', 'out': false},
		{'in': 'for (int x=1;x+100;x++) { point(x, x); }', 'out': false},
		{'in': 'for (int x=1;100+x;x++) { point(x, x); }', 'out': false},
		{'in': 'for (int x=1;x;x++) { point(x, x); }', 'out': false},
		{'in': 'for (int x=1;x<100;x++) { point(x, x); }', 'out': true},
		{'in': 'for (int x=0;x<100;x++) {}', 'out': true},
		{'in': 'for (int x=100;x>0;x--) {}', 'out': true},
		{'in': 'for (int x=10;x<100;x++) {}', 'out': true},
		{'in': 'for (x=10;x<100;x++) {}', 'out': true},
		{'in': 'for (x=0;x<100;x++) {}', 'out': true},
		{'in': 'for (x=0;x<10;x++) {}', 'out': true},
		{'in': 'for (z123=0;z123<10;z123+=2) {}', 'out': true},
	];
	processForTokenToSimpleValueTest(cases, shouldTranslateToRepeatWithConstantLimit, logger);
};