import { isNumberLengthUnitLiteral } from
'../../../../../../../../../parsing/css/scanning/isNumberLengthUnitLiteral.js';
import { ParseTreeTokenType } from
'../../../../../../../../../parsing/css/ParseTreeTokenType.js';

export function isFontSize(cssToken) {
	if (cssToken.type === ParseTreeTokenType.NUMBER_UNIT_LITERAL) {
		return isNumberLengthUnitLiteral(cssToken.val);
	}
	return false;
};