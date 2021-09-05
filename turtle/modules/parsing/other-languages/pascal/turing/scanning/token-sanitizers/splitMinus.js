import { isComment } from
'../isComment.js';
import { isNumberLiteralStart } from
'../isNumberLiteralStart.js';
import { Operators } from
'../../Operators.js';
import { toMapKey } from
'../../scanTokenToParseTreeToken.js';
import { Token } from
'../../../../../generic-parsing-utilities/Token.js';

const badPreviousValues = new Set([
	',', ';', ':', '[', ']',
	'(', '/', '*', '..'
]);
for (const info of Operators.getAll()) {
	if (info.unary === undefined) {
		badPreviousValues.add(toMapKey(info.symbol));
	}
}

function getNonCommentBefore(tokens, i) {
	i--;
	while (i >= 0 && isComment(tokens[i].s))
		i--;
	return tokens[i];	
}

function isOfInterest(tokens, i) {
	const token = tokens[i];
	if (token.s.length <= 1 ||
	token.s[0] !== '-')
		return false;

	const previous = getNonCommentBefore(tokens, i);
	if (previous === undefined)
		return false;

	if (badPreviousValues.has(toMapKey(previous.s)))
		return false;

	if (isNumberLiteralStart(previous.s))
		return true;

	return false;
		// We don't know if the previous can be a - binary operand
		// so we don't want to make any changes.
}

export function splitMinus(tokens) {
	for (let i = 1; i < tokens.length; i++) {
		const token = tokens[i];
		if (isOfInterest(tokens, i)) {
			const afterS = token.s.substring(1);
			const minus = new Token('-', token.colIndex - token.s.length + 1, token.lineIndex);
			tokens.splice(i, 0, minus); // insert the minus token.
			token.s = afterS;
		}
	}
};