const regex1 = /^-?[0-9]*$/;
const regex2 = /^-?[0-9]+(\.[0-9]*)?$/;

export function isStartOfNumberLiteral(s) {
	if (regex1.test(s))
		return true;
	return regex2.test(s);
};