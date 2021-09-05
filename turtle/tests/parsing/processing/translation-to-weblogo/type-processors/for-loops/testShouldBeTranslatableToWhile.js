import { processForTokenToSimpleValueTest } from
'../processForTokenToSimpleValueTest.js';
import { shouldBeTranslatableToWhile } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/for-loops/shouldBeTranslatableToWhile.js';

export function testShouldBeTranslatableToWhile(logger) {
	const cases = [
		{'in': 'for', 'out': false},
		{'in': 'for ()', 'out': false},
		{'in': 'for () {}', 'out': false},
		{'in': 'for (;;) {}', 'out': false},
		{'in': 'for (;x < 100;) {}', 'out': true},
	];
	processForTokenToSimpleValueTest(cases, shouldBeTranslatableToWhile, logger);
};