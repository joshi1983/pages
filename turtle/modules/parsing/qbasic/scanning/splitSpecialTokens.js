import { isNumberLiteralStart } from './isNumberLiteralStart.js';
import { mayBeAdjacent } from
'../../generic-parsing-utilities/mayBeAdjacent.js';
import { Token } from
'../../generic-parsing-utilities/Token.js';

// looks for tokens like '-34' immediately after another number token.
// For example, '23-34' will be scanned as '23', '-34' but 
// this module should also isolate the - as an operator for something like '23, '-', '34'.
function shouldConvertNegativeSignToBinaryOperator(tokens, i) {
	const token = tokens[i];
	if (token.s[0] !== '-' || i === 0 || token.s === '-')
		return false;
	const prev = tokens[i - 1];
	if (!mayBeAdjacent(prev, token))
		return false;

	if (isNumberLiteralStart(prev.s))
		return true;
	return false;
}

function processToken(tokens, i) {
	const token = tokens[i];
	if (shouldConvertNegativeSignToBinaryOperator(tokens, i)) {
		const minusOperatorToken = new Token('-', token.colIndex - token.s.length + 1, token.lineIndex);
		token.s = token.s.substring(1); // remove the - prefix.
		tokens.splice(i, 0, minusOperatorToken);
	}
}

export function splitSpecialTokens(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		processToken(tokens, i);
	}
}