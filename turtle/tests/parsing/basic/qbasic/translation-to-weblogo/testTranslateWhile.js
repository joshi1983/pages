import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateWhile(logger) {
	const cases = [{
	'in': `const F%=4
WHILE F%
print "hi"
WEND`,
	'outContains': `while :F [`
	}
];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};