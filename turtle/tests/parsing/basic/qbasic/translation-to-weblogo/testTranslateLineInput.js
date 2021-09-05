import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateLineInput(logger) {
	const cases = [
	{
		'in': `line input x
print x`,
		'out': `make "x 'lineOfText'
print :x`}
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};