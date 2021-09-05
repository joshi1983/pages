import { scan } from '../scanning/scan.js';
import { scanTokensToCode } from
'../../../../components/code-editor/code-fixer/fixers/helpers/scanTokensToCode.js';
import { translate0LToWebLogo } from
'../../0L/translation-to-weblogo/translate0LToWebLogo.js';

export function translateCGJenningsToWebLogo(code) {
	const tokens = scan(code);
	const zeroLCode = scanTokensToCode(tokens);
	return translate0LToWebLogo(zeroLCode);
};