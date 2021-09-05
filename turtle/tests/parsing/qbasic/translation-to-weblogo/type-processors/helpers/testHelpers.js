import { testIdentifierToWebLogoIdentifier } from './testIdentifierToWebLogoIdentifier.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testHelpers(logger) {
	wrapAndCall([
		testIdentifierToWebLogoIdentifier
	], logger);
};