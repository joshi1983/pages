import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translateToWebLogo } from
'../../../../modules/parsing/js-parsing/translation-to-weblogo/translateToWebLogo.js';

export function testTranslateArrayUsage(logger) {
	const cases = [
		{'in': 'x = []', 'out': 'make "x [ ]'},
		{'in': 'x = []\nx.push(3)', 'out': 'make "x [ ]\nqueue2 "x 3'},
		{'in': 'x = []\nconsole.log(x.length)', 'out': 'make "x [ ]\nprint count :x'}
	];
	testInOutPairs(cases, translateToWebLogo, logger);
};