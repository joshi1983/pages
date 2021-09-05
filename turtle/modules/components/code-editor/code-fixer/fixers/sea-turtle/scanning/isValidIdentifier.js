export function isValidIdentifier(s) {
	return /^[a-z_.][a-z_.\d]*$/.test(s);	
};