import { testJsProcessingColorArgsToWebLogoColorLiteral } from
'./testJsProcessingColorArgsToWebLogoColorLiteral.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testTypeProcessors(logger) {
	wrapAndCall([
		testJsProcessingColorArgsToWebLogoColorLiteral
	], logger);
};