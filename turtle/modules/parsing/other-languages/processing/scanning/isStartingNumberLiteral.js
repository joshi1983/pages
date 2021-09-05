const signedNumberRegEx = new RegExp('^[+-]?((\\d+\\.?\\d*[eE][-+]?)|(\\d+\\.?\\d*[eE][-+]?\\d+)|(\\.\\d+)|(\\d+\\.\\d*)|(\\d+))$');
const hexNumberRegEx = /^(0x|#)[a-fA-F\d]*$/;

export function isStartingNumberLiteral(s) {
	if (s === '-' || s === '#' || s === '0x')
		return true;
	if (signedNumberRegEx.test(s))
		return true;
	if (hexNumberRegEx.test(s))
		return true;
	return false;
};