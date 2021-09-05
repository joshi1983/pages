import { translateSinclairBasicToQBasic } from
'./translateSinclairBasicToQBasic.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function translateSinclairBasicToWebLogo(sinclairBasicCode) {
	const qbasicCode = translateSinclairBasicToQBasic(sinclairBasicCode);
	return translateQBASICToWebLogo(qbasicCode);
};