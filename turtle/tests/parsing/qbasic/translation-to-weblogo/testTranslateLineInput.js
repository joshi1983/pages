import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

export function testTranslateLineInput(logger) {
	const cases = [
	{
		'in': `line input x
print x`,
		'out': `make "x 'lineOfText'
print :x`}
	];
	testInOutPairs(cases, translate, logger);
};