export function isIdentifier(s) {
	if (s === '$')
		return true;
	return /^[a-z][a-z\d]*$/i.test(s);
};