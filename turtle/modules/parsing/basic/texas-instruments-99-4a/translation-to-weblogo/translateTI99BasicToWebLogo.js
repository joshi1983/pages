import { includeReferencedProcedures } from './includeReferencedProcedures.js';
import { processToken } from
'./type-processors/processToken.js';
import { scan } from '../scanning/scan.js';
import { scanTokensToCode } from '../../helpers/scanTokensToCode.js';
import { shouldUseCustomProcessTokenForToken } from
'./type-processors/shouldUseCustomProcessTokenForToken.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function translateTI99BasicToWebLogo(code) {
	const tokens = scan(code);
	const qbasicCode = scanTokensToCode(tokens);
	const options = {
		'shouldUseCustomProcessTokenForToken': shouldUseCustomProcessTokenForToken,
		'processToken': processToken
	};
	const webLogoCode = translateQBASICToWebLogo(qbasicCode, options);
	return includeReferencedProcedures(webLogoCode);
};