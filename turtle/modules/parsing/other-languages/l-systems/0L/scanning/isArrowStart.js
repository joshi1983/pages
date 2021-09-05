const pattern = /^[-]+>?$/;

export function isArrowStart(s) {
	return pattern.test(s);
};