import { testReplaceInvalidIndentationSymbols } from './testReplaceInvalidIndentationSymbols.js';
import { testSanitizePythonCode } from './testSanitizePythonCode.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testCodeSanitizers(logger) {
	wrapAndCall([
		testReplaceInvalidIndentationSymbols,
		testSanitizePythonCode
	], logger);
};