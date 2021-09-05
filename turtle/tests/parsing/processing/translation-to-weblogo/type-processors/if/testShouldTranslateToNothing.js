import { processForTokenToSimpleValueTest } from './processForTokenToSimpleValueTest.js';
import { shouldTranslateToNothing } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/if/shouldTranslateToNothing.js';

export function testShouldTranslateToNothing(logger) {
	const cases = [
		{'in': 'if', 'out': true},
		{'in': 'if (num', 'out': true},
		{'in': 'if (num)', 'out': true},
		{'in': 'if (num) {}', 'out': false},
	];
	processForTokenToSimpleValueTest(cases, shouldTranslateToNothing, logger);
};