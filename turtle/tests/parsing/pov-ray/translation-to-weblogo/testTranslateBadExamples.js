import { badExamples } from '../badExamples.js';
import { genericTranslateBadExamples } from '../../../helpers/parsing/genericTranslateBadExamples.js';
import { translate } from
'../../../../modules/parsing/pov-ray/translation-to-weblogo/translate.js';

export function testTranslateBadExamples(logger) {
	genericTranslateBadExamples(badExamples, translate, logger);
};