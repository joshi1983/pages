import { testGetMakeCommandNameForToken } from './testGetMakeCommandNameForToken.js';
import { testIdentifierToWebLogoIdentifier } from './testIdentifierToWebLogoIdentifier.js';
import { testTranslateRead } from './testTranslateRead.js';
import { wrapAndCall } from
'../../../../../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		testGetMakeCommandNameForToken,
		testIdentifierToWebLogoIdentifier,
		testTranslateRead
	], logger);
};