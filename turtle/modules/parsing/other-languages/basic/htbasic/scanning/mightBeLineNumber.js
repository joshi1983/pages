export function mightBeLineNumber(s) {
	if (/^\d+$/.test(s))
		return true;
	
	return false;
};