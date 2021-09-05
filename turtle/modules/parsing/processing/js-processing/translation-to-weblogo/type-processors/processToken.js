import { ParseTreeTokenType } from
'../../../../js-parsing/ParseTreeTokenType.js';
import { processFunctionCall } from './processFunctionCall.js';
import { processJavaScriptGeneralToken } from
'../../../../js-parsing/translation-to-weblogo/type-processors/processJavaScriptGeneralToken.js';

const processors = new Map([
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