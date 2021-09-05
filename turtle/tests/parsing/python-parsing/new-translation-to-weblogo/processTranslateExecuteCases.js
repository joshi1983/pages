import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../helpers/parsing/processTranslateExecuteCases.js';
import { newTranslatePythonCodeToWebLogo } from
'../../../../modules/parsing/python-parsing/newTranslatePythonCodeToWebLogo.js';
import { asyncInit } from
'../../../../modules/parsing/python-parsing/new-translation-to-weblogo/tokenToWebLogoCode.js';

export async function processTranslateExecuteCases(cases, logger) {
	await asyncInit();
	processTranslateExecuteCasesGeneric(cases, newTranslatePythonCodeToWebLogo, logger);
};