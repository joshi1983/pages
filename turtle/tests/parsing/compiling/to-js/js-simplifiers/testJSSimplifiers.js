import { testRemoveUnneededCurvedBrackets } from
'./testRemoveUnneededCurvedBrackets.js';
import { testSimplifyJavaScriptCode } from
'./testSimplifyJavaScriptCode.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testJSSimplifiers(logger) {
	wrapAndCall([
		testRemoveUnneededCurvedBrackets,
		testSimplifyJavaScriptCode
	], logger);
};