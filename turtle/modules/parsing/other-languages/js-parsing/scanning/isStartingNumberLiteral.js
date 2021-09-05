const signedNumberRegEx = new RegExp('^[+-]?((\\d+\\.?\\d*[eE][-+]?)|(\\d+\\.?\\d*[eE][-+]?\\d+)|(\\.\\d+)|(\\d+\\.\\d*)|(\\d+))$');
const hexNumber = new RegExp('^[+-]?0[xX][0-9a-fA-F]*$');

export function isStartingNumberLiteral(s) {
	if (s === '-' || s === '-.')
		return true;
	if (signedNumberRegEx.test(s))
		return true;
	if (hexNumber.test(s))
		return true;
	return false;
};