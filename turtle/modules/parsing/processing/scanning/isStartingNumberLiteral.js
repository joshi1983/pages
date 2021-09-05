const signedNumberRegEx = new RegExp('^[+-]?((\\d+\\.?\\d*[eE][-+]?)|(\\d+\\.?\\d*[eE][-+]?\\d+)|(\\.\\d+)|(\\d+\\.\\d*)|(\\d+))$');

export function isStartingNumberLiteral(s) {
	if (s === '-')
		return true;
	if (signedNumberRegEx.test(s))
		return true;
	return false;
};