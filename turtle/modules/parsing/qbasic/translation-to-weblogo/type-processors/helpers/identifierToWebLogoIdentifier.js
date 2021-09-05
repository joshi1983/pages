const charsToRemove = new Set('!@#$%^&'.split(''));

export function identifierToWebLogoIdentifier(s) {
	s = s.split('').filter(c => !charsToRemove.has(c)).join('');
	return s;
};