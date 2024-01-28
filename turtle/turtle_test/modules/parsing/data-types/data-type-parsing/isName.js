export function isName(s) {
	if (s.length !== 1)
		return true;
	return '<>|*'.indexOf(s) === -1;
};