import { ParseTreeTokenType } from
'../../../../../../../../../parsing/other-languages/css/ParseTreeTokenType.js';

const styles = new Set(['italic', 'normal', 'oblique', 'revert']);

export function isFontStyle(cssToken) {
	if (cssToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	return styles.has(cssToken.val);
};