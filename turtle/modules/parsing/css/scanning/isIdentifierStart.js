const pattern = /^-{0,2}([a-z_](-?[a-z_0-9]+)*-?)?$/i;

export function isIdentifierStart(s) {
	if (s === '')
		return false;
	return pattern.test(s);
};