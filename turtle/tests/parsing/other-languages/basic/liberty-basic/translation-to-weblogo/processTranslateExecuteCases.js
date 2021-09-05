import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../../../helpers/parsing/processTranslateExecuteCases.js';
import { translateLibertyBasicToWebLogo } from
'../../../../../../modules/parsing/other-languages/basic/liberty-basic/translation-to-weblogo/translateLibertyBasicToWebLogo.js';

export function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, translateLibertyBasicToWebLogo, logger);
};