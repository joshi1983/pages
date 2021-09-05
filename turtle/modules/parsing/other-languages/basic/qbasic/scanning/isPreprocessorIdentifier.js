const regex = /^\$[a-z_]+[a-z_0-9]*$/i;

export function isPreprocessorIdentifier(s) {
	return regex.test(s);
};