const regex = /^[a-z_][a-z_0-9]*$/i;

export function isIdentifier(s) {
	if (s.length > 40)
		return false;
	return regex.test(s);
};