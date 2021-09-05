import { isIdentifier } from
'../qbasic/scanning/isIdentifier.js';
import { Token } from
'../../generic-parsing-utilities/Token.js';

export function genericProcessDecomposeAssignment(migrationInfo) {
	const operators = migrationInfo.operators.filter(o => o.decomposeAssignment === true);
	const operatorsMap = new Map();
	for (const op of operators) {
		operatorsMap.set(op.symbol.toLowerCase(), op);
	}
	return function(scanTokens) {
		for (let i = 1; i < scanTokens.length - 1; i++) {
			const prev = scanTokens[i - 1];
			const prevS = prev.s;
			if (!isIdentifier(prevS))
				continue;
			const token = scanTokens[i];
			const s = token.s.toLowerCase();
			const fullS = s + '=';
			if (operatorsMap.has(fullS)) {
				const next = scanTokens[i + 1];
				const nextS = next.s;
				if (next.lineIndex === token.lineIndex && nextS === '=') {
					const newVariableToken = new Token(prev.s, next.colIndex, next.lineIndex);
					scanTokens.splice(i + 1, 0, newVariableToken);
					next.colIndex -= s.length;
					token.colIndex = newVariableToken.colIndex + 1;
					token.lineIndex = newVariableToken.lineIndex;
					scanTokens[i] = next;
					// [i + 1] will be newVariableToken.
					scanTokens[i + 2] = token;
				}
			}
		}
	};
};