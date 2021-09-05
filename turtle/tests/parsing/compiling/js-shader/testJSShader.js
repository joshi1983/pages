import { testTranslateWebLogoShaderToJSShader } from
'./testTranslateWebLogoShaderToJSShader.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testJSShader(logger) {
	return wrapAndCall([
		testTranslateWebLogoShaderToJSShader
	], logger);
};