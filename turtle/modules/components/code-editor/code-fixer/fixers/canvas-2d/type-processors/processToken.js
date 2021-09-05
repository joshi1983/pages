import { ParseTreeTokenType } from
'../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processAssignment } from './processAssignment.js';
import { processDeclaration } from './processDeclaration.js';
import { processFunctionCall } from './processFunctionCall.js';
import { processIdentifier } from './processIdentifier.js';
import { processIf } from './processIf.js';
import { processJavaScriptGeneralToken } from
'../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/processJavaScriptGeneralToken.js';

const processors = new Map([
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processAssignment],
	[ParseTreeTokenType.CONST, processDeclaration],
	[ParseTreeTokenType.FUNCTION_CALL, processFunctionCall],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.LET, processDeclaration],
	[ParseTreeTokenType.VAR, processDeclaration],
]);
const processTokenForJavaScriptInGeneral = processJavaScriptGeneralToken(processToken);

export function processToken(token, result, settings) {
	const processor = processors.get(token.type);
	if (processor !== undefined)
		processor(token, result, settings);
	else {
		processTokenForJavaScriptInGeneral(token, result, settings);
	}
};