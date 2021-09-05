import { getSwitchValueName } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/switch/getSwitchValueName.js';
import { processForTokenToSimpleValueTest } from './processForTokenToSimpleValueTest.js';

export function testGetSwitchValueName(logger) {
	const cases = [
		{'in': 'switch (1) {}', 'out': '1'},
		{'in': 'switch (-1) {}', 'out': '-1'},
		{'in': 'switch ("hi") {}', 'out': '"hi'},
		{'in': 'switch (true) {}', 'out': 'true'},
		{'in': 'switch (false) {}', 'out': 'false'},
		{'in': 'switch (x) {}', 'out': ':x'},
		{'in': 'switch (x+1) {case 0: case 1: println("one or 0");}', 'out': ':switchValue'},
		{'in': 'int switchValue = 0; switch (x+1) {case 0: case 1: println("one or 0");}', 'out': ':switchValue1'},
	];
	processForTokenToSimpleValueTest(cases, getSwitchValueName, logger);
};