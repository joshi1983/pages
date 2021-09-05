import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

export function testTranslateSwap(logger) {
	const cases = [
	{'in': `swap x, y`,
'out': `swap "x "y`}];
	testInOutPairs(cases, translate, logger);
};