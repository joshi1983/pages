import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/pov-ray/translation-to-weblogo/translate.js';

export function testTranslateSphere(logger) {
	const cases = [
	{'in': 'sphere {}', 'out': 'sphere 100'},
	];
	testInOutPairs(cases, translate, logger);
};