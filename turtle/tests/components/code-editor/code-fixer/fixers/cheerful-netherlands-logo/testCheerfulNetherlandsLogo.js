import { testGetCodeForReferencedProcedures } from './testGetCodeForReferencedProcedures.js';
import { testIsLikelyCheerfulNetherlandsLogo } from './testIsLikelyCheerfulNetherlandsLogo.js';
import { testTranslateToWebLogo } from './testTranslateToWebLogo.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testCheerfulNetherlandsLogo(logger) {
	wrapAndCall([
		testGetCodeForReferencedProcedures,
		testIsLikelyCheerfulNetherlandsLogo,
		testTranslateToWebLogo,
	], logger);
};