import { badExamples } from '../badExamples.js';
import { genericTranslateBadExamples } from '../../../helpers/parsing/genericTranslateBadExamples.js';
import { translateToWebLogo } from
'../../../../modules/parsing/js-parsing/translation-to-weblogo/translateToWebLogo.js';

export function testTranslateBadExamples(logger) {
	genericTranslateBadExamples(badExamples, translateToWebLogo, logger);
};