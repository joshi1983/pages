import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translateToWebLogo } from
'../../../../modules/parsing/js-parsing/translation-to-weblogo/translateToWebLogo.js';

export function testTranslateFunctionDefinitions(logger) {
	const cases = [
		{'in': 'function procName1() {}', 'out': 'to procName1\nend'},
		{'in': 'function p() {}', 'out': 'to p\nend'},
		{'in': 'function p() {x=4;}', 'out': 'to p\n\tmake "x 4\nend'},
		// make instead of localmake because x would be a global variable in that JavaScript.
		{'in': 'function p() {var x=4; x = 5;}', 'out': 'to p\n\tlocalmake "x 4\n\tlocalmake "x 5\nend'},

		{'in': 'function p(x) {}', 'out': 'to p :x\nend'},
		{'in': 'function p(x,y) {}', 'out': 'to p :x :y\nend'},
		{'in': 'function p(x) {x = 4}', 'out': 'to p :x\n\tlocalmake "x 4\nend'},
	];
	testInOutPairs(cases, translateToWebLogo, logger);
};