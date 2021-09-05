import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/pov-ray/translation-to-weblogo/translate.js';

export function testTranslateToGetProperty(logger) {
	const cases = [
	{'in': '#debug x.y', 'out': 'print getProperty "x "y'},
	];
	testInOutPairs(cases, translate, logger);
};