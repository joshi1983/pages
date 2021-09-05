const regex = /^\$[a-fA-F\d]+$/;

export function isAmosHexLiteral(s) {
	return regex.test(s);
};