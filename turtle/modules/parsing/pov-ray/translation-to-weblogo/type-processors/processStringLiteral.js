import { stringValueToWebLogoStringLiteral } from '../../../generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';

export function processStringLiteral(token, result) {
	let val = token.val.substring(1);
	if (val.endsWith('"'))
		val = val.substring(0, val.length - 1);
	result.append(' ' + stringValueToWebLogoStringLiteral(val) + ' ');
};