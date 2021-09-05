import { processForTokenToSimpleValueTest } from
'../processForTokenToSimpleValueTest.js';
import { shouldTranslateToRepeatWithLimitExpression } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/for-loops/shouldTranslateToRepeatWithLimitExpression.js';

export function testShouldTranslateToRepeatWithLimitExpression(logger) {
	const cases = [
		{'in': 'for (;;) {}', 'out': false},
		{'in': 'for (;true;) {}', 'out': false},
		{'in': 'for (int x=1; x>-10; x--) { point(x, x); }', 'out': false},
		{'in': 'for (int x=1; x<100; x++) { point(x, x); }', 'out': false},
		{'in': 'for (int x=1;x+100;x++) { point(x, x); }', 'out': false},
		{'in': 'for (int x=1;100+x;x++) { point(x, x); }', 'out': false},
		{'in': 'for (int x=0;x+100;x++) { point(x, x); }', 'out': false},
		{'in': 'for (int x=0;100+x;x++) { point(x, x); }', 'out': false},
		{'in': 'for (int x=0;; x++) { point(x, x); }', 'out': false},
		{'in': 'for (int x=0; x<100; x++) {}', 'out': false},
		{'in': 'for (int x=0; x<limit; x++) {}', 'out': true},
	];
	processForTokenToSimpleValueTest(cases, shouldTranslateToRepeatWithLimitExpression, logger);
};