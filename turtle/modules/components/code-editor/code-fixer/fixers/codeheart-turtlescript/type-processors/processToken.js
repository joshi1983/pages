import { ParseTreeTokenType } from
'../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processFunctionCall } from './processFunctionCall.js';
import { processIdentifier } from './processIdentifier.js';
import { processJavaScriptGeneralToken } from
'../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/processJavaScriptGeneralToken.js';

const processors = new Map([
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.FUNCTION_CALL, processFunctionCall],
]);
const processTokenForJavaScriptInGeneral = processJavaScriptGeneralToken(processToken);

export function processToken(token, result) {
	const processor = processors.get(token.type);
	if (processor !== undefined)
		processor(token, result);
	else {
		processTokenForJavaScriptInGeneral(token, result);
	}
};