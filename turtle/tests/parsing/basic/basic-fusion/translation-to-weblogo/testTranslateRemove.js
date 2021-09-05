import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateBasicFusionToWebLogo } from
'../../../../../modules/parsing/basic/basic-fusion/translation-to-weblogo/translateBasicFusionToWebLogo.js';

export function testTranslateRemove(logger) {
	const cases = [
		{'in': 'sync', 'out': ''},
		{'in': 'sync(60)', 'out': ''},
		{'in': 'fastgraphics', 'out': ''},
	];
	testInOutPairs(cases, translateBasicFusionToWebLogo, logger);
};