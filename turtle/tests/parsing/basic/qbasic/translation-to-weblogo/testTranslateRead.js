import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateRead(logger) {
	const cases = [
	{
		'in': `read x
print x - 3`,
		'out': `make "x 1
print :x - 3`}
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};