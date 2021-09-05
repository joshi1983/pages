import { testWebLogoIdentifierToJavaScriptIdentifier } from
'./testWebLogoIdentifierToJavaScriptIdentifier.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		testWebLogoIdentifierToJavaScriptIdentifier
	], logger);
};