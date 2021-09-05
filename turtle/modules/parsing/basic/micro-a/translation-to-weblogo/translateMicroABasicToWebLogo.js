import { isApplicableTo, processFunctionCall } from
'./type-processors/processFunctionCall.js';
import { scan } from '../scanning/scan.js';
import { scanTokensToCode } from
'../../helpers/scanTokensToCode.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function translateMicroABasicToWebLogo(code) {
	const tokens = scan(code);
	const qbasicCode = scanTokensToCode(tokens);
	const options = {
		'shouldUseCustomProcessTokenForToken': isApplicableTo,
		'processToken': processFunctionCall
	};
	return translateQBASICToWebLogo(qbasicCode, options);
};