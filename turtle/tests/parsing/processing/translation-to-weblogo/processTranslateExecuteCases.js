import { LogoParser } from
'../../../../modules/parsing/LogoParser.js';
import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../helpers/parsing/processTranslateExecuteCases.js';
import { translate } from
'../../../../modules/parsing/processing/translation-to-weblogo/translate.js';

await LogoParser.asyncInit();

export function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, translate, logger);
};