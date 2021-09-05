import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../helpers/parsing/processTranslateExecuteCases.js';
import { translatePythonCodeToWebLogo } from
'../../../../modules/parsing/python-parsing/translatePythonCodeToWebLogo.js';

export function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, translatePythonCodeToWebLogo, logger);
};