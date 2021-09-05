import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateTuringToWebLogo } from
'../../../../../../modules/parsing/other-languages/pascal/turing/translation-to-weblogo/translateTuringToWebLogo.js';

export function testTranslateArrayAssignments(logger) {
	const cases = [
		{
			'in': `a(1) := 2`, 'out': `setItem 1 "a 2`
		},
		{
			'in': `arr(x) := y`, 'out': `setItem :x "arr :y`
		}
	];
	testInOutPairs(cases, translateTuringToWebLogo, logger);
};