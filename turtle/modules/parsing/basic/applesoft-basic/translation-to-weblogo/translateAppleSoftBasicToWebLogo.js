import { translateAppleSoftBasicToQBasic } from
'./translateAppleSoftBasicToQBasic.js';
import { translate } from
'../../qbasic/translation-to-weblogo/translate.js';

export function translateAppleSoftBasicToWebLogo(applesoftBasicCode) {
	const qbasicCode = translateAppleSoftBasicToQBasic(applesoftBasicCode);
	return translate(qbasicCode);
};