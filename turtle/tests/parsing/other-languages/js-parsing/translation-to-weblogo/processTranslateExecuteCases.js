import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../../helpers/parsing/processTranslateExecuteCases.js';
import { translateToWebLogo } from
'../../../../../modules/parsing/other-languages/js-parsing/translation-to-weblogo/translateToWebLogo.js';

export function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, translateToWebLogo, logger);
};