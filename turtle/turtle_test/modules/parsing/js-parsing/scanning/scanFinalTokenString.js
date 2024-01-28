import { isCompleteRegularExpression } from './isCompleteRegularExpression.js';
import { isStartingRegularExpression } from './isStartingRegularExpression.js';
import { Operators } from '../Operators.js';
import { scan } from './scan.js';
import { Token } from './Token.js';

function getLongestOperatorPrefixing(s) {
	let result = '';
	const operators = Operators.getAll();
	for (let i = 0; i < operators.length; i++) {
		const op = operators[i];
		if (s.startsWith(op.symbol) && op.symbol.length > result.length) {
			result = op.symbol;
		}
	}
	return result;
}

export function scanFinalTokenString(s,
startColIndex, startLineIndex) {
	if (s.length === 0)
		return [];
	if (!isCompleteRegularExpression(s)) {
		if (s.length > 1 && isStartingRegularExpression(s)) {
			const longestOperator = getLongestOperatorPrefixing(s);
			let tokens = [];
			if (s.length > longestOperator.length)
				tokens = scan(s.substring(longestOperator.length));
			const result = [new Token(longestOperator, startColIndex + longestOperator.length - 1, startLineIndex)];
			startColIndex += longestOperator.length;
			tokens.forEach(function(token) {
				if (token.lineIndex === 0)
					token.colIndex += startColIndex;
				token.lineIndex += startLineIndex;
				result.push(token);
			});
			return result;
		}
	}
	for (let i = 0; i < s.length - 1; i++) {
		const ch = s[i];
		if (ch === '\n') {
			startLineIndex++;
			startColIndex = 0;
		}
		else {
			startColIndex++;
		}
	}
	return [new Token(s, startColIndex, startLineIndex)];
};