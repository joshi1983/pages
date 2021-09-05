export function isDecoratorStart(s) {
	return /^@[a-z_]?[a-z_\d]*$/.test(s);
};