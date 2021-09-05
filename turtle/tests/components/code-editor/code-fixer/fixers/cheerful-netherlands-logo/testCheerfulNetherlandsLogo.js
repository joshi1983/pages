import { testGetCodeForReferencedProcedures } from './testGetCodeForReferencedProcedures.js';
import { testIsLikelyCheerfulNetherlandsLogo } from './testIsLikelyCheerfulNetherlandsLogo.js';
import { testProcessVariableReferences } from './testProcessVariableReferences.js';
import { testTranslateCheerfulToWebLogo } from './testTranslateCheerfulToWebLogo.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testCheerfulNetherlandsLogo(logger) {
	wrapAndCall([
		testGetCodeForReferencedProcedures,
		testIsLikelyCheerfulNetherlandsLogo,
		testProcessVariableReferences,
		testTranslateCheerfulToWebLogo,
	], logger);
};