import { scan } from '../scanning/scan.js';
import { scanTokensToCode } from
'../../helpers/scanTokensToCode.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function translateAmosBasicToWebLogo(code) {
	const tokens = scan(code);
	const qbasicCode = scanTokensToCode(tokens);
	return translateQBASICToWebLogo(qbasicCode);
};