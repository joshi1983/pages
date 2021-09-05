import { processForTokenToSimpleValueTest } from
'../processForTokenToSimpleValueTest.js';
import { shouldBeTranslatableToFor } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/for-loops/shouldBeTranslatableToFor.js';

export function testShouldBeTranslatableToFor(logger) {
	const cases = [
		{'in': 'for (;;) {}', 'out': false},
		{'in': 'for (int x;;) {}', 'out': false},
		{'in': 'for (int x=2;;) {}', 'out': false},
		{'in': 'for (int x=2;;x++) {}', 'out': false},
		{'in': 'for (int x=2,y=3;x<100;x++) {}', 'out': false},
		{'in': 'for (int x=2;x<100;x*=2) {}', 'out': false},
		{'in': 'for (int x=2;x<100;x/=2) {}', 'out': false},
		{'in': 'for (int x=2;x%2==0;x+=2) {}', 'out': false},
		{'in': 'for (int x=2;x;x+=2) {}', 'out': false},
		{'in': 'for (int x=2;x<100 && x%2==0;x+=2) {}', 'out': false},
		{'in': 'for (int x=2;x++<100;x+=2) {}', 'out': false},
		{'in': 'for (int x=2;++x<100;x+=2) {}', 'out': false},
		{'in': 'for (int x=2;++x++<100;x+=2) {}', 'out': false},
		{'in': 'for (int x=2;f(x);x+=2) {}', 'out': false},
		{'in': 'for (int x=2;x<100;x+=2) {}', 'out': true},
		{'in': 'for (int x=2;x<100;x-=2) {}', 'out': true},
		{'in': 'for (int x=2;x<100;x++) {}', 'out': true},
		{'in': 'for (int x=1;x<100;x++) {}', 'out': true},
		{'in': 'for (int x=2;x<limit;x++) {}', 'out': true},
		{'in': 'for (int x=2;x<limit;x++) {f(x)}', 'out': true},
		{'in': 'int stepValue=2;for (int x=2;x<limit;x+=stepValue) {f(x)}', 'out': true},
		{'in': 'int stepValue=2;for (int x=2;x<limit;x-=stepValue) {f(x)}', 'out': true},
		{'in': 'int stepValue=2;for (int x=2;x<limit;x+=stepValue) {f(x);stepValue++}', 'out': false},
		{'in': 'int stepValue=2;for (int x=2;x<limit;x-=stepValue) {f(x);++stepValue}', 'out': false},
		{'in': 'int stepValue=2;for (int x=2;x<limit;x+=stepValue) {f(x);stepValue+=2}', 'out': false},
		{'in': 'int stepValue=2;for (int x=2;x<limit;x-=stepValue) {f(x);stepValue+=3}', 'out': false},
	];
	processForTokenToSimpleValueTest(cases, shouldBeTranslatableToFor, logger);
};