import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translateProcessingToWebLogo } from
'../../../../modules/parsing/processing/translation-to-weblogo/translateProcessingToWebLogo.js';

export function testTranslateProcessingToWebLogo(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'println(x.length)', 'out': 'print count :x'},
	];
	testInOutPairs(cases, translateProcessingToWebLogo, logger);
};