import { isIdentifier } from
'../../qbasic/scanning/isIdentifier.js';
import { Token } from
'../../../Token.js';

export function mergeTokensForAssignmentOperators(scanTokens, operatorsArray) {
	const operatorsMap = new Map();
	for (const op of operatorsArray) {
		const symbol = op.symbol;
		if (symbol !== '=' && symbol.endsWith('='))
			operatorsMap.set(symbol.substring(0, symbol.length - 1), op);
	}
	for (let i = 2; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		const s = token.s;
		if (s !== '=')
			continue;
		const prev = scanTokens[i - 1];
		const variableName = scanTokens[i - 2];
		if (!isIdentifier(variableName.s))
			continue;
		if (operatorsMap.has(prev.s.toLowerCase())) {
			const prevS = prev.s;
			prev.s = '=';
			token.s = variableName.s;
			const newOperatorToken = new Token(prevS, token.colIndex + 1, token.lineIndex);
			scanTokens.splice(i + 1, 0, newOperatorToken);
			// insert new operator token.
		}
	}
};