export function isREMComment(s) {
	return /^REM(\s|$)/.test(s);
};