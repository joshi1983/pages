import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../helpers/parsing/processTranslateExecuteCases.js';
import { translateBBCBasicToWebLogo } from
'../../../../modules/parsing/bbc-basic/translation-to-weblogo/translateBBCBasicToWebLogo.js';

export function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, translateBBCBasicToWebLogo, logger);
};