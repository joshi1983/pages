import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../../../helpers/parsing/processTranslateExecuteCases.js';
import { translateMicroABasicToWebLogo } from
'../../../../../../modules/parsing/other-languages/basic/micro-a/translation-to-weblogo/translateMicroABasicToWebLogo.js';

export function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, translateMicroABasicToWebLogo, logger);
};