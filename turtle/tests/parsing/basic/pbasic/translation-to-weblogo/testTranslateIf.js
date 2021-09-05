import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translatePBasicToWebLogo } from
'../../../../../modules/parsing/basic/pbasic/translation-to-weblogo/translatePBasicToWebLogo.js';

export function testTranslateIf(logger) {
	const cases = [
		{'in': 'if x then f()', 'out': `if :x [
	f
]`},
	];
	testInOutPairs(cases, translatePBasicToWebLogo, logger);
};