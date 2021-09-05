import { testRemoveUnneededCurvedBrackets } from
'./testRemoveUnneededCurvedBrackets.js';
import { testSimplifyJavaScriptCode } from
'./testSimplifyJavaScriptCode.js';
import { testUseFasterMathFunctions } from
'./testUseFasterMathFunctions.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testJSSimplifiers(logger) {
	return wrapAndCall([
		testRemoveUnneededCurvedBrackets,
		testSimplifyJavaScriptCode,
		testUseFasterMathFunctions
	], logger);
};