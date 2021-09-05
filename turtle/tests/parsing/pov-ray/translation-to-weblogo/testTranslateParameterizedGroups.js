import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/pov-ray/translation-to-weblogo/translate.js';

export function testTranslateParameterizedGroups(logger) {
	const cases = [
	{'in': 'box {}', 'out': ''},
	];
	testInOutPairs(cases, translate, logger);
};