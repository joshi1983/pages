import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../../../helpers/parsing/processTranslateExecuteCases.js';
import { translateTektronix405XBasicToWebLogo } from
'../../../../../../modules/parsing/other-languages/basic/tektronix-405x-basic/translation-to-weblogo/translateTektronix405XBasicToWebLogo.js';

export function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, translateTektronix405XBasicToWebLogo, logger);
};