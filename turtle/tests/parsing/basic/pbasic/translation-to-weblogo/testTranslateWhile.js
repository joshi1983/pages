import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translatePBasicToWebLogo } from
'../../../../../modules/parsing/basic/pbasic/translation-to-weblogo/translatePBasicToWebLogo.js';

export function testTranslateWhile(logger) {
	const cases = [
		{'in': 'while (x) {}',
			'out': `while :x [
]`},
	];
	testInOutPairs(cases, translatePBasicToWebLogo, logger);
};