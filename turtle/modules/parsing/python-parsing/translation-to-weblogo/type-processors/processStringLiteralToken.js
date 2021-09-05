import { stringValueToWebLogoStringLiteral } from '../../../generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';

export function processStringLiteralToken(token, result, cachedParseTree) {
	result.append(stringValueToWebLogoStringLiteral(token.val));
};