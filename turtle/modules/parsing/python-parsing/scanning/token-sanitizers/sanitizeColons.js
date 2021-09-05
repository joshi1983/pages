import { Token } from
'../../../generic-parsing-utilities/Token.js';

function removeConsecutiveColons(scanTokens) {
	for (let i = 1; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		if (tok.s === ':') {
			const prev = scanTokens[i - 1];
			if (prev.s === ':') {
				scanTokens.splice(i, 1); // remove the extra comma.
				i--;
			}
		}
	}
}

const valuesImmediatelyPrecedingColons = new Set([
	'finally', 'try'
]);
function insertRequiredColons(scanTokens) {
	for (let i = 0; i < scanTokens.length - 1; i++) {
		const tok = scanTokens[i];
		if (valuesImmediatelyPrecedingColons.has(tok.s)) {
			const next = scanTokens[i + 1];
			if (next.s !== ':') {
				// insert the colon.
				scanTokens.splice(i + 1, 0, new Token(':', tok.colIndex + 1, tok.lineIndex));
				i++;
			}
		}
	}
}

export function sanitizeColons(scanTokens) {
	removeConsecutiveColons(scanTokens);
	insertRequiredColons(scanTokens);
};