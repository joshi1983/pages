import { StringUtils } from
'../../StringUtils.js';
const safeCharacters = '#0123456789abcdefghijklmnopqrstuvwxyz.,-_';

function isRegularQuoteSafe(s) {
	s = s.toLowerCase();
	for (let i = 0; i < s.length; i++) {
		if (safeCharacters.indexOf(s.charAt(i)) === -1)
			return false;
	}
	return true;
}

function escapeApostrophe(s) {
	return StringUtils.replacePairs(s, [["'", "\\'"]]);
}

export function stringValueToWebLogoStringLiteral(s) {
	if (isRegularQuoteSafe(s))
		return `"${s}`;
	else
		return `'${escapeApostrophe(s)}'`;
};