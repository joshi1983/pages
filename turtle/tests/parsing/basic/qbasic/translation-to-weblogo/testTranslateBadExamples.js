import { badExamples } from '../badExamples.js';
import { genericTranslateBadExamples } from
'../../../../helpers/parsing/genericTranslateBadExamples.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateBadExamples(logger) {
	genericTranslateBadExamples(badExamples, translateQBASICToWebLogo, logger);
};