const signedNumberRegEx = new RegExp('^[+-]?((\\d+\\.?\\d*[eE][-+]?\\d+)|(\\.\\d+)|(\\d+\\.\\d*)|(\\d+))$');

export function isCompleteNumberLiteral(s) {
	if (signedNumberRegEx.test(s))
		return true;

	return false;
};