import { badExamples } from '../badExamples.js';
import { genericTranslateBadExamples } from
'../../../../helpers/parsing/genericTranslateBadExamples';
import { translate } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translate.js';

export function testTranslateBadExamples(logger) {
	genericTranslateBadExamples(badExamples, translate, logger);
};