import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateBasicFusionToWebLogo } from
'../../../../../modules/parsing/basic/basic-fusion/translation-to-weblogo/translateBasicFusionToWebLogo.js';

export function testTranslateFunctionCalls(logger) {
	const cases = [
		{'in': 'print 3', 'out': 'print 3'},
		{'in': 'linewidth 2', 'out': 'setPenSize 2'},
		{'in': 'fontsize 10', 'out': 'setFontSize 10'}
	];
	testInOutPairs(cases, translateBasicFusionToWebLogo, logger);
};