import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/pov-ray/translation-to-weblogo/translate.js';

export function testTranslateBinaryOperators(logger) {
	const cases = [
	{'in': '#debug 1 != 2', 'out': 'print 1 <> 2'},
	];
	testInOutPairs(cases, translate, logger);
};