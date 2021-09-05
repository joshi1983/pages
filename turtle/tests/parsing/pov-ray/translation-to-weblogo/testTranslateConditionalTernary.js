import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from '../../../../modules/parsing/pov-ray/translation-to-weblogo/translate.js';

export function testTranslateConditionalTernary(logger) {
	const cases = [
	{'in': '#debug 1 < 2 ? 3 : 4', 'out': 'print ifelse 1 < 2 3 4'},
	{'in': '#debug 1 < 2 ? "hi" : "bye"', 'out': 'print ifelse 1 < 2 "hi "bye'},
	];
	testInOutPairs(cases, translate, logger);
};