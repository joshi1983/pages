import { testFilterBracketsAndCommas } from './testFilterBracketsAndCommas.js';
import { testGetMakeCommandNameForToken } from './testGetMakeCommandNameForToken.js';
import { testIdentifierToWebLogoIdentifier } from './testIdentifierToWebLogoIdentifier.js';
import { testTranslateRead } from './testTranslateRead.js';
import { wrapAndCall } from
'../../../../../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		testFilterBracketsAndCommas,
		testGetMakeCommandNameForToken,
		testIdentifierToWebLogoIdentifier,
		testTranslateRead
	], logger);
};