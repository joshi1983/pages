import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

export function testTranslateRead(logger) {
	const cases = [
	{
		'in': `read x
print x - 3`,
		'out': `make "x 1
print :x - 3`}
	];
	testInOutPairs(cases, translate, logger);
};