import { translateBasilBasicToQBasic } from './translateBasilBasicToQBasic.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function translateBasilBasicToWebLogo(code) {
	const qbasicCode = translateBasilBasicToQBasic(code);
	return translateQBASICToWebLogo(qbasicCode, {
		'parseForEachLoops': true
	});
};