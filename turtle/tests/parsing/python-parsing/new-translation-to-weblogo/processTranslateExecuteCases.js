import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../helpers/parsing/processTranslateExecuteCases.js';
import { newTranslatePythonCodeToWebLogo } from
'../../../../modules/parsing/python-parsing/newTranslatePythonCodeToWebLogo.js';

export function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, newTranslatePythonCodeToWebLogo, logger);
};