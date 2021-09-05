import { testIsLikelySuperLogo } from './testIsLikelySuperLogo.js';
import { testJoinHyphenatedProcedureNames } from './testJoinHyphenatedProcedureNames.js';
import { testReplaceCurvedBracketsFixer } from './testReplaceCurvedBracketsFixer.js';
import { testSuperLogoToWebLogo } from './testSuperLogoToWebLogo.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

export function testSuperLogo(logger) {
	wrapAndCall([
		testIsLikelySuperLogo,
		testJoinHyphenatedProcedureNames,
		testReplaceCurvedBracketsFixer,
		testSuperLogoToWebLogo
	], logger);
};