const signedNumberRegEx = new RegExp('^[+-]?((\\d+\\.?\\d*[eE][-+]?\\d+)|(\\.\\d+)|(\\d+\\.\\d*)|(\\d+))$');
const completeHex = /^(0x|#)[a-fA-F\d]+$/;

export function isCompleteNumberLiteral(s) {
	if (signedNumberRegEx.test(s))
		return true;
	if (completeHex.test(s))
		return true;

	return false;
};