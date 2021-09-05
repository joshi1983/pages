// https://www.codeguage.com/courses/regexp/flags
const flagsString = 'gimsuy';
const flags = new Set(flagsString.split(''));

export function isRegularExpressionFlags(s) {
	if (s.length > flagsString.length)
		return false;
	for (let i = 0; i < s.length; i++) {
		const ch = s[i];
		if (!flags.has(ch))
			return false;
	}
	return true;
};