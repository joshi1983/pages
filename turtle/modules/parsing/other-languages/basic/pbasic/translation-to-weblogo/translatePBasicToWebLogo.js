import { isApplicableTo, pBasicProcessToken } from
'./type-processors/pBasicProcessToken.js';
import { scan } from '../scanning/scan.js';
import { scanTokensToCode } from '../../helpers/scanTokensToCode.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

function translatePBasicToQBasic(pBasicCode) {
	const tokens = scan(pBasicCode);
	return scanTokensToCode(tokens);
}

export function translatePBasicToWebLogo(code) {
	const qbasicCode = translatePBasicToQBasic(code);
	const options = {
		'shouldUseCustomProcessTokenForToken': isApplicableTo,
		'processToken': pBasicProcessToken,
	};
	return translateQBASICToWebLogo(qbasicCode, options);
};