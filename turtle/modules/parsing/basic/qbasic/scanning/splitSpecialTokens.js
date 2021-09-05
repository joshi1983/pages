import { isIdentifier } from './isIdentifier.js';
import { isCompleteNumberLiteral } from './isCompleteNumberLiteral.js';
import { mayBeAdjacent } from
'../../../generic-parsing-utilities/mayBeAdjacent.js';
import { QBasicInternalFunctions } from
'../QBasicInternalFunctions.js';
import { QBasicKeywords } from
'../QBasicKeywords.js';
import { Token } from
'../../../generic-parsing-utilities/Token.js';

function isFunction(s) {
	return QBasicInternalFunctions.getFunctionInfo(s) !== undefined;
}

function isNoArgNumericFounction(s) {
	const info = QBasicInternalFunctions.getFunctionInfo(s);
	if (info === undefined)
		return false;
	if (info.returnTypes === null)
		return false;
	const argCount = info.argCount;
	if (argCount !== undefined) {
		if (argCount.max !== 0)
			return false;
	}
	else if (info.args !== undefined) {
		if (info.args.length !== 0)
			return false;
	}
	if (info.returnTypes !== undefined) {
		return info.returnTypes === 'num' ||
			info.returnTypes === 'int'
	}
	return true;
}

// looks for tokens like '-34' immediately after another number token.
// For example, '23-34' will be scanned as '23', '-34' but 
// this module should also isolate the - as an operator for something like '23, '-', '34'.
function shouldConvertNegativeSignToBinaryOperator(tokens, i) {
	const token = tokens[i];
	if ((token.s[0] !== '-' &&
	token.s[0] !== '–') || i === 0 || 
	(token.s === '-' || token.s === '–'))
		return false;
	// The above if-condition is not redundantly comparing with the same hyphen twice.
	// It is comparing with 2 different characters that only LOOK like the same hyphen(-) character.

	const prev = tokens[i - 1];
	if (!mayBeAdjacent(prev, token))
		return false;

	if (isCompleteNumberLiteral(prev.s))
		return true;

	if (isIdentifier(prev.s) && !QBasicKeywords.isKeyword(prev.s)
	&& (!isFunction(prev.s) || isNoArgNumericFounction(prev.s)))
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