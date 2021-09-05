import { formatCode } from
'../../../../../components/code-editor/format/formatCode.js';
import { translateLibertyBasicToQBasic } from
'./translateLibertyBasicToQBasic.js';
import { translateQBASICToWebLogo } from
'../../qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function translateLibertyBasicToWebLogo(code) {
	const qbasicCode = translateLibertyBasicToQBasic(code);
	const webLogoCode = translateQBASICToWebLogo(qbasicCode);
	return formatCode(webLogoCode);
};