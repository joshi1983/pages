import { translate } from
'../qbasic/translation-to-weblogo/translate.js';
import { translateBBCBasicToQBasic } from
'./translateBBCBasicToQBasic.js';

export function translateBBCBasicToWebLogo(bbcBasicCode) {
	const qbasicCode = translateBBCBasicToQBasic(bbcBasicCode);
	return translate(qbasicCode);
};