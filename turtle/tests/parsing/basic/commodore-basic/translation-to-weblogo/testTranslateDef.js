import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateCommodoreBasicToWebLogo } from
'../../../../../modules/parsing/basic/commodore-basic/translation-to-weblogo/translateCommodoreBasicToWebLogo.js';

export function testTranslateDef(logger) {
	const cases = [
		{'in': 'def fnx(x) = x * 3', 'out': 'to fnx :x\n\toutput :x * 3\nend'},
	];
	testInOutPairs(cases, translateCommodoreBasicToWebLogo, logger);
};
