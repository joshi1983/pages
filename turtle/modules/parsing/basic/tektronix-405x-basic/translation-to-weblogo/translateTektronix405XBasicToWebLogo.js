import { replaceDegreeTrigFunctions } from
'./replaceDegreeTrigFunctions.js';
import { translateTektronix405XBasicToQBasic } from
'./translateTektronix405XBasicToQBasic.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function translateTektronix405XBasicToWebLogo(tBasicCode) {
	const qbasicCode = translateTektronix405XBasicToQBasic(tBasicCode);
	const webLogoCode = translateQBASICToWebLogo(qbasicCode, undefined, replaceDegreeTrigFunctions);
	return webLogoCode;
};