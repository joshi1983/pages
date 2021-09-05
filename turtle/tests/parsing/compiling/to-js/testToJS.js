import { testCommandsToJS } from
'./testCommandsToJS.js';
import { testExecuteTests } from
'./testExecuteTests.js';
import { testJSSimplifiers } from
'./js-simplifiers/testJSSimplifiers.js';
import { testTranslateBadCode } from
'./testTranslateBadCode.js';
import { testTranslateWebLogoToJS } from
'./testTranslateWebLogoToJS.js';
import { testWebLogoToJavaScriptJSON } from
'./testWebLogoToJavaScriptJSON.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testToJS(logger) {
	wrapAndCall([
		testCommandsToJS,
		testExecuteTests,
		testJSSimplifiers,
		testTranslateBadCode,
		testTranslateWebLogoToJS,
		testWebLogoToJavaScriptJSON
	], logger);
};