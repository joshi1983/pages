const signedNumberRegEx = new RegExp('^[+-]?((\\d+\\.?\\d*[eE][-+]?\\d+)|(\\.\\d+)|(\\d+\\.\\d*)|(\\d+))$');
const hexNumber = new RegExp('^[+-]?0[xX][0-9a-fA-F]+$');

export function isCompleteNumberLiteral(s) {
	if (signedNumberRegEx.test(s))
		return true;
	
	return hexNumber.test(s);
};