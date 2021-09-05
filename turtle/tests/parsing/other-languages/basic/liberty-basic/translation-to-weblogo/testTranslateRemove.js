import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateLibertyBasicToWebLogo } from
'../../../../../../modules/parsing/other-languages/basic/liberty-basic/translation-to-weblogo/translateLibertyBasicToWebLogo.js';

export function testTranslateRemove(logger) {
	const cases = [
		{'in': '[x]', 'out': ''},
		{'in': `goto [x]
[x]`, 'out': ''},
	];
	testInOutPairs(cases, translateLibertyBasicToWebLogo, logger);
};