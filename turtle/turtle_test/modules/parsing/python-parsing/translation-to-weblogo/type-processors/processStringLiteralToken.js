import { stringValueToWebLogoStringLiteral } from './helpers/stringValueToWebLogoStringLiteral.js';

export function processStringLiteralToken(token, result, cachedParseTree) {
	result.append(stringValueToWebLogoStringLiteral(token.val));
};