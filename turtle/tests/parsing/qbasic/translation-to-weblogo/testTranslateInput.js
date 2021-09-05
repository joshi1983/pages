import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

export function testTranslateInput(logger) {
	const cases = [
	{
		'in': `input "hi";x
print x - 3`,
		'out': `make "x 1
print :x - 3`},{
		'in': `input "hi";x
print x + "yo"`,
		'out': `make "x 'hi'
print word str :x "yo`}];
	testInOutPairs(cases, translate, logger);
};