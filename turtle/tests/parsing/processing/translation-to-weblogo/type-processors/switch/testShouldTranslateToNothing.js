import { processForTokenToSimpleValueTest } from './processForTokenToSimpleValueTest.js';
import { shouldTranslateToNothing } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/switch/shouldTranslateToNothing.js';

export function testShouldTranslateToNothing(logger) {
	const cases = [
		{'in': 'switch', 'out': true},
		{'in': 'switch (num', 'out': true},
		{'in': 'switch (num)', 'out': true},
		{'in': 'switch (num) {}', 'out': true},
		{'in': `switch (num) {
			default:
				println("hello");
		}`, 'out': false},
		{'in': `switch (num) {
	case 1: println("hi");
		}`, 'out': false},
		{'in': `switch (num) {
	case 1: println("hi");
		break;
	case 2: println("hi");
		}`, 'out': false},
	];
	processForTokenToSimpleValueTest(cases, shouldTranslateToNothing, logger);
};