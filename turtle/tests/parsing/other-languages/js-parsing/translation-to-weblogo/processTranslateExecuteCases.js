import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../../helpers/parsing/processTranslateExecuteCases.js';
import { translateToWebLogo_ } from
'./translateToWebLogo_.js';

export function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, translateToWebLogo_, logger);
};