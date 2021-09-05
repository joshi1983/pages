import { testIdentifierToWebLogoIdentifier } from './testIdentifierToWebLogoIdentifier.js';
import { testTranslateRead } from './testTranslateRead.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		testIdentifierToWebLogoIdentifier,
		testTranslateRead
	], logger);
};