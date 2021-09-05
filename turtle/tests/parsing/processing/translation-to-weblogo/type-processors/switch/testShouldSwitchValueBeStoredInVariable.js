import { processForTokenToSimpleValueTest } from './processForTokenToSimpleValueTest.js';
import { shouldSwitchValueBeStoredInVariable } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/switch/shouldSwitchValueBeStoredInVariable.js';

export function testShouldSwitchValueBeStoredInVariable(logger) {
	const cases = [
		{'in': 'switch', 'out': false},
		{'in': 'switch ()', 'out': false},
		{'in': 'switch (3', 'out': false},
		{'in': 'switch (3)', 'out': false},
		{'in': 'switch (x)', 'out': false},
		{'in': 'switch (x + 3)', 'out': false},
		{'in': 'switch (x * 3)', 'out': false},
		{'in': 'switch (x + 3) {}', 'out': false},
		{'in': 'switch (x * 3) {}', 'out': false},
		{'in': `switch (x * 3) {
			default:
				println("One");
		}`, 'out': false},
		{'in': `switch (x + 3) {
			case 1:
				println("One")
		}`, 'out': false},
		{'in': `switch (x * 3) {
			case 1:
				println("One")
		}`, 'out': false},
		{'in': `switch (x + 3) {
			case 0:
			case 1:
				println("One")
		}`, 'out': true},
		{'in': `switch (x * 3) {
			case 0:
			case 1:
				println("One")
		}`, 'out': true},
	];
	processForTokenToSimpleValueTest(cases, shouldSwitchValueBeStoredInVariable, logger);
};