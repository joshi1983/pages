import { stringLiteralToValue } from '../../stringLiteralToValue.js';
import { stringValueToWebLogoStringLiteral } from
'../../../python-parsing/translation-to-weblogo/type-processors/helpers/stringValueToWebLogoStringLiteral.js';

export function processStringLiteral(token, result) {
	const val = stringLiteralToValue(token.val);
	result.append(stringValueToWebLogoStringLiteral(val));
};