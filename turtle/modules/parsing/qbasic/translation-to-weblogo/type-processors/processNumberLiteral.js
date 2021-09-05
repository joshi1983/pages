import { isHexNumberLiteralStart } from
'../../scanning/isHexNumberLiteralStart.js';

export function processNumberLiteral(token, result, options) {
	if (isHexNumberLiteralStart(token.val)) {
		result.append('' + parseInt(token.val.substring(2), 16));
	}
	else {
		result.append('' + token.val);
	}
};