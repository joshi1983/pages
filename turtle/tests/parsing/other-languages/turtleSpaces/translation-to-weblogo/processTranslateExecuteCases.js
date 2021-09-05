import { processTranslateExecuteCases as processTranslateExecuteCasesGeneric } from
'../../../../helpers/parsing/processTranslateExecuteCases.js';
import { translateTurtleSpacesToWebLogo } from
'../../../../../modules/parsing/other-languages/turtleSpaces/translation-to-weblogo/translateTurtleSpacesToWebLogo.js';

export async function processTranslateExecuteCases(cases, logger) {
	processTranslateExecuteCasesGeneric(cases, translateTurtleSpacesToWebLogo, logger);
};