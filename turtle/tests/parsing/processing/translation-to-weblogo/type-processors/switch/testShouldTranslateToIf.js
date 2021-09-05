import { processForTokenToSimpleValueTest } from './processForTokenToSimpleValueTest.js';
import { shouldTranslateToIf } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/switch/shouldTranslateToIf.js';

export function testShouldTranslateToIf(logger) {
	const cases = [
		{'in': 'switch', 'out': false},
		{'in': 'switch (num', 'out': false},
		{'in': 'switch (num)', 'out': false},
		{'in': 'switch (num) {}', 'out': false},
		{'in': `switch (num) {
			default:
				println("hello");
		}`, 'out': false},
		{'in': `switch (num) {
	case 1: println("hi");
		}`, 'out': true},
		{'in': `switch (num) {
	case 1: println("hi");
		break;
	case 2: println("hi");
		}`, 'out': false}, // should become ifelse.  Not if.
		{'in': `switch (num) {
	case 1:
	case 2: println("hi");
		}`, 'out': true},
	];
	processForTokenToSimpleValueTest(cases, shouldTranslateToIf, logger);
};