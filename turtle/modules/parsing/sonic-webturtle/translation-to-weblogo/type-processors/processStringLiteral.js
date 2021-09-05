import { stringValueToWebLogoStringLiteral } from
'../../../generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';

export function processStringLiteral(token, result, settings) {
	result.append(' ' + stringValueToWebLogoStringLiteral(token.val) + ' ');
};