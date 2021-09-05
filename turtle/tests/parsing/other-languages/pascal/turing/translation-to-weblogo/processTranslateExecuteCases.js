import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../../../helpers/parsing/processTranslateExecuteCases.js';
import { translateTuringToWebLogo } from
'../../../../../../modules/parsing/other-languages/pascal/turing/translation-to-weblogo/translateTuringToWebLogo.js';

export async function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, translateTuringToWebLogo, logger);
};