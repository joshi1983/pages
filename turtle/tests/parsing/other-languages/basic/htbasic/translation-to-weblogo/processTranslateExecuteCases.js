import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../../../helpers/parsing/processTranslateExecuteCases.js';
import { translateHTBasicToWebLogo } from
'../../../../../../modules/parsing/other-languages/basic/htbasic/translation-to-weblogo/translateHTBasicToWebLogo.js';

export function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, translateHTBasicToWebLogo, logger);
};