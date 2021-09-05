import { processForTokenToSimpleValueTest } from './processForTokenToSimpleValueTest.js';
import { shouldTranslateToIf } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/if/shouldTranslateToIf.js';

export function testShouldTranslateToIf(logger) {
	const cases = [
		{'in': 'if', 'out': false},
		{'in': 'if (1)', 'out': false},
		{'in': 'if (true)', 'out': false},
		{'in': 'if (false)', 'out': false},
		{'in': 'if (false) {} else {}', 'out': false},
		{'in': 'if (false) {} else if  {}', 'out': false},
		{'in': 'if (false) {}', 'out': true},
	];
	processForTokenToSimpleValueTest(cases, shouldTranslateToIf, logger);
};