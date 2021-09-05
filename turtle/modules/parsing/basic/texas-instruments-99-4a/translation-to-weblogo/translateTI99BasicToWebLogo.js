import { scan } from '../scanning/scan.js';
import { scanTokensToCode } from '../../helpers/scanTokensToCode.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function translateTI99BasicToWebLogo(code) {
	const tokens = scan(code);
	const qbasicCode = scanTokensToCode(tokens);
	const webLogoCode = translateQBASICToWebLogo(qbasicCode, undefined);
	return webLogoCode;
};