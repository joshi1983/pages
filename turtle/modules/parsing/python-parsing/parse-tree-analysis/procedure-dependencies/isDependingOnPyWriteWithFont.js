import { getTokensByType } from '../../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { shouldTranslateToPyWriteWithFont } from
'../../new-translation-to-weblogo/type-processors/function-calls/processWrite.js';

export function isDependingOnPyWriteWithFont(cachedParseTree) {
	const functionCalls = getTokensByType(cachedParseTree, ParseTreeTokenType.FUNCTION_CALL);
	return functionCalls.some(callToken => shouldTranslateToPyWriteWithFont(callToken));
};