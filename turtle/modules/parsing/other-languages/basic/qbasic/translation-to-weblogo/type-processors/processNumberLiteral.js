import { evaluateNumberLiteral } from
'../../evaluation/evaluateNumberLiteral.js';
import { isHexNumberLiteralStart } from
'../../scanning/isHexNumberLiteralStart.js';
import { isOctalNumberLiteralStart } from
'../../scanning/isOctalNumberLiteralStart.js';

const typeSuffixCharacters = new Set('&%!#'.split(''));

function removeTypeSuffix(s) {
	while (typeSuffixCharacters.has(s[s.length - 1]))
		s = s.substring(0, s.length - 1);
	if (s[0] === '#')
		s = s.substring(1);
	return s;
}

export function processNumberLiteral(token, result, options) {
	if (isHexNumberLiteralStart(token.val) ||
	isOctalNumberLiteralStart(token.val)) {
		result.append(' ' + evaluateNumberLiteral(token));
	}
	else {
		result.append(' ' + removeTypeSuffix(token.val));
	}
};