import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../../helpers/parsing/processTranslateExecuteCases.js';
import { translateBasic256ToWebLogo } from
'../../../../../modules/parsing/basic/basic-256/translation-to-weblogo/translateBasic256ToWebLogo.js';

export function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, translateBasic256ToWebLogo, logger);
};