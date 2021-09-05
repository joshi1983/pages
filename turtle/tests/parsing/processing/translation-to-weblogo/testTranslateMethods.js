import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/processing/translation-to-weblogo/translate.js';

export function testTranslateMethods(logger) {
	const cases = [
		{'in': `void p() {}`, 'out': 'to p\nend'},
		{'in': `void p() {int x = 4;}`, 'out': 'to p\n\tlocalmake "x 4\nend'},
		{'in': `void draw() {}`, 'outContains': 'to draw\nend'},
		{'in': `int p() { return 2;}`, 'out': 'to p\n\toutput 2\nend'},
		{'in': `int p() { return;}`, 'out': 'to p\n\tstop\nend'},
	];
	testInOutPairs(cases, translate, logger);
};