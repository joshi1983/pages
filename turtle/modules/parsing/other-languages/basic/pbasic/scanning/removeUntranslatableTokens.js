import { isCompleteNumberLiteral } from
'../../qbasic/scanning/isCompleteNumberLiteral.js';
import { isIdentifier } from
'./isIdentifier.js';
import { isStartOfOperator } from
'../../qbasic/scanning/isStartOfOperator.js';

function removeBufferStatements(scanTokens, i) {
	const token = scanTokens[i];
	if (token.s.toLowerCase() !== 'buffer')
		return;
	const next = scanTokens[i + 1];
	if (next !== undefined && next.s === ':' && next.lineIndex === token.lineIndex) {
		const after = scanTokens[i + 2];
		if (after !== undefined &&
		(isIdentifier(after.s) || isCompleteNumberLiteral(after.s))) {
			const afterAfter = scanTokens[i + 3];
			if (afterAfter !== undefined &&
			afterAfter.lineIndex === token.lineIndex &&
			isStartOfOperator(afterAfter.s))
				return 0; // for example, buffer:1+x*a
				// In a complicated case like that, it will be easier to manually fix the problem if the buffer: tokens remain.
				// leaving the tokens will make the problem easier for a human code reviewer to understand.
				// Turning "buffer:1+x*a" to "+x*a" or "x*a" will be more confusing.

			return 3;
		}
		return 2;
	}
	return 1;
}

const removers = [
	removeBufferStatements
];

export function removeUntranslatableTokens(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		let decrementI = false;
		for (const remover of removers) {
			const lenToRemove = remover(scanTokens, i);
			if (lenToRemove > 0) {
				scanTokens.splice(i, lenToRemove);
				decrementI = true;
			}
		}
		if (decrementI)
			i--;
	}
};