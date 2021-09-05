import { translateToWebLogo as translateJSToWebLogo } from
'../../js-parsing/translation-to-weblogo/translateToWebLogo.js';

export function translateTurtleGraphicsFunToWebLogo(code) {
	const webLogoCode = translateJSToWebLogo(code);
	return webLogoCode;
};