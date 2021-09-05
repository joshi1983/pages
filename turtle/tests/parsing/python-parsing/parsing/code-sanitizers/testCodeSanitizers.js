import { testReplaceInvalidIndentationSymbols } from './testReplaceInvalidIndentationSymbols.js';
import { testSanitizeIndentation } from './testSanitizeIndentation.js';
import { testSanitizePythonCode } from './testSanitizePythonCode.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testCodeSanitizers(logger) {
	wrapAndCall([
		testReplaceInvalidIndentationSymbols,
		testSanitizeIndentation,
		testSanitizePythonCode
	], logger);
};