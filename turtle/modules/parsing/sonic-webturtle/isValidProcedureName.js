const invalidAnywhereChars = new Set(' \t\r\n+-~!@#%^&*()[]{}|<>?/,=`'.split(''));

export function isValidProcedureName(s) {
	// can't start with a digit.
	if (s[0] <= '9' && s[0] >= '0')
		return false;
	for (let i = 0; i < s.length; i++) {
		if (invalidAnywhereChars.has(s[i]))
			return false;
	}
	return true;
};