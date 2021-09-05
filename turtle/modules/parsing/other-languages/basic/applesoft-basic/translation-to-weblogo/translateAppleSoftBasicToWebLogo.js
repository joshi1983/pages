import { translateAppleSoftBasicToQBasic } from
'./translateAppleSoftBasicToQBasic.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function translateAppleSoftBasicToWebLogo(applesoftBasicCode) {
	const qbasicCode = translateAppleSoftBasicToQBasic(applesoftBasicCode);
	return translateQBASICToWebLogo(qbasicCode);
};