import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../../helpers/parsing/processTranslateExecuteCases.js';
import { translateJossToWebLogo } from
'../../../../../modules/parsing/other-languages/joss/translation-to-weblogo/translateJossToWebLogo.js';

export async function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, translateJossToWebLogo, logger);
};