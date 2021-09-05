import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../../helpers/parsing/processTranslateExecuteCases.js';
import { translatePitrifiedGoTurtleToWebLogo } from
'../../../../../modules/parsing/other-languages/pitrified-go-turtle/translation-to-weblogo/translatePitrifiedGoTurtleToWebLogo.js';

export async function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, translatePitrifiedGoTurtleToWebLogo, logger);
};