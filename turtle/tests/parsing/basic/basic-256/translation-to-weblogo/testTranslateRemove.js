import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateBasic256ToWebLogo } from
'../../../../../modules/parsing/basic/basic-256/translation-to-weblogo/translateBasic256ToWebLogo.js';

export function testTranslateRemove(logger) {
	const cases = [
		{'in': 'pause 0.1', 'out': ''},
		{'in': 'fastgraphics', 'out': ''},
	];
	testInOutPairs(cases, translateBasic256ToWebLogo, logger);
};