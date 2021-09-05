import { testTranslate } from
'./testTranslate.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
			testTranslate
		], logger);
};