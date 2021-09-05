const pattern = /^([a-z_]|\p{L})(\p{L}|[a-z_\d])*$/iu;

export function isIdentifier(s) {
	return pattern.test(s);
};