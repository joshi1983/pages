import { stringValueToWebLogoStringLiteral } from '../../../generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';

function trimStringLiteral(s) {
	s = s.substring(1);
	const ch = s[s.length - 1];
	if ('"\''.indexOf(ch) !== -1)
		return s.substring(0, s.length - 1);
	return s;
}

export function processStringLiteralToken(token, result, cachedParseTree) {
	result.append(stringValueToWebLogoStringLiteral(trimStringLiteral(token.val)));
};