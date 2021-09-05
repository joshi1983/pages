import { processForTokenToSimpleValueTest } from './processForTokenToSimpleValueTest.js';
import { shouldTranslateToDefaultOnly } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/switch/shouldTranslateToDefaultOnly.js';

export function testShouldTranslateToDefaultOnly(logger) {
	const cases = [
		{'in': 'switch', 'out': false},
		{'in': 'switch (num', 'out': false},
		{'in': 'switch (num)', 'out': false},
		{'in': 'switch (num) {}', 'out': false},
		{'in': `switch (num) {
			default:
				println("hello");
		}`, 'out': true},
		{'in': `switch (num) {
	case 1: println("hi");
		}`, 'out': false},
		{'in': `switch (num) {
	case 1: println("hi");
		break;
	case 2: println("hi");
		}`, 'out': false},
	];
	processForTokenToSimpleValueTest(cases, shouldTranslateToDefaultOnly, logger);
};