import { isFontStyle } from './isFontStyle.js';
import { isFontWeight } from './isFontWeight.js';
import { ParseTreeTokenType } from
'../../../../../../../../../parsing/css/ParseTreeTokenType.js';

export function isFontFamily(cssToken) {
	if (cssToken.type === ParseTreeTokenType.IDENTIFIER)
		return !isFontStyle(cssToken) && !isFontWeight(cssToken);
	if (cssToken.type === ParseTreeTokenType.STRING_LITERAL)
		return true;
	return false;
};