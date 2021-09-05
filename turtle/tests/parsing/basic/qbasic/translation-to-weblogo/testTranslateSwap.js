import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateSwap(logger) {
	const cases = [
	{'in': `swap x, y`,
'out': `swap "x "y`}];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};