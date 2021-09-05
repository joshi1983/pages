export function isREMComment(s) {
	return /^REM([\s"]|$)/i.test(s);
};