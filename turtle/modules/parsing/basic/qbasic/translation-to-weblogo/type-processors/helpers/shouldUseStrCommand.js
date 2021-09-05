import { isNumberToken } from
'../../../parsing/parse-tree-analysis/variable-data-types/isNumberToken.js';
import { isStringToken } from
'../../../parsing/parse-tree-analysis/variable-data-types/isStringToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function shouldUseStrCommand(token, options) {
	if (isNumberToken(token, options))
		return true;
	if (isStringToken(token, options))
		return false;
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		// guess type off suffix.
		const lastChar = token.val[0];
		if ('&%!#'.indexOf(lastChar) !== -1)
			return true;
		if ('$' === lastChar)
			return false;
	}
	return true;
};