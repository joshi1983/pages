import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../../helpers/parsing/processTranslateExecuteCases.js';
import { translate } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translate.js';

export function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, translate, logger);
};