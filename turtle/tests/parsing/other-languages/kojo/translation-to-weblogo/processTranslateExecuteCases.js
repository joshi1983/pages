import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../../helpers/parsing/processTranslateExecuteCases.js';
import { translateKojoToWebLogo } from
'../../../../../modules/parsing/other-languages/kojo/translation-to-weblogo/translateKojoToWebLogo.js';

export async function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, translateKojoToWebLogo, logger);
};