import { badExamples } from '../badExamples.js';
import { genericTranslateBadExamples } from
'../../../../helpers/parsing/genericTranslateBadExamples.js';
import { translateToWebLogo_ } from
'./translateToWebLogo_.js';

export function testTranslateBadExamples(logger) {
	genericTranslateBadExamples(badExamples, translateToWebLogo_, logger);
};