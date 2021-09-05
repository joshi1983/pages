import { isAnnotationStart } from './isAnnotationStart.js';
import { isMarkingEndOfToken as isMarkingEndOfTokenProcessing } from
'../../processing/scanning/isMarkingEndOfToken.js';
import { isNumberLiteralStart } from
'./isNumberLiteralStart.js';
import { Operators } from
'../Operators.js';
import { StringUtils } from
'../../../StringUtils.js';

export function isMarkingEndOfToken(prev, nextChar) {
	if (isAnnotationStart(prev))
		return !isAnnotationStart(prev + nextChar);
	if (StringUtils.isWhitespace(nextChar)) {
		const opInfo = Operators.getOperatorInfo(prev);
		if (opInfo !== undefined)
			return true;
	}
	else {
		const opInfo = Operators.getOperatorInfo(prev + nextChar);
		if (opInfo !== undefined)
			return false;
	}
	if (isNumberLiteralStart(prev + nextChar))
		return false;
	if (isNumberLiteralStart(prev))
		return true;
	return isMarkingEndOfTokenProcessing(prev, nextChar);
};