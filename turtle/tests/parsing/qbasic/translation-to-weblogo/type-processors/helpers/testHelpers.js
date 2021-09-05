import { testIdentifierToWebLogoIdentifier } from './testIdentifierToWebLogoIdentifier.js';
import { testMightBeString } from './testMightBeString.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		testIdentifierToWebLogoIdentifier,
		testMightBeString
	], logger);
};