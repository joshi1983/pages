import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateTuringToWebLogo } from
'../../../../../../modules/parsing/other-languages/pascal/turing/translation-to-weblogo/translateTuringToWebLogo.js';

export function testTranslateAssert(logger) {
	const cases = [
		{
			'in': `assert 1 < x`, 'out': `assert 1 < :x`
		},
		{
			'in': `assert x`, 'out': `assert :x`
		}
	];
	testInOutPairs(cases, translateTuringToWebLogo, logger);
};