import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { translateProcessingToWebLogo } from
'../../../../modules/parsing/processing/translation-to-weblogo/translateProcessingToWebLogo.js';

export function testTranslateConditionalTernary(logger) {
	const cases = [
		{'in': `println(false ? 1 : 2)`, 'out': 'print ifelse false 1 2'},
		{'in': `println(x > 3 ? 1 : 2)`, 'out': 'print ifelse :x > 3 1 2'},
	];
	testInOutPairs(cases, translateProcessingToWebLogo, logger);
};