import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../../helpers/parsing/processTranslateExecuteCases.js';
import { translateTI99BasicToWebLogo } from
'../../../../../modules/parsing/basic/texas-instruments-99-4a/translation-to-weblogo/translateTI99BasicToWebLogo.js';

export function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, translateTI99BasicToWebLogo, logger);
};