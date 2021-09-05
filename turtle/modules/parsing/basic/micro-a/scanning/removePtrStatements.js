import { isIdentifier } from
'../../qbasic/scanning/isIdentifier.js';

function getPtrStatementLength(scanTokens, i) {
	const token = scanTokens[i];
	if (token.s.toLowerCase() !== 'ptr')
		return 0;

	let len;
	for (len = 1; true; len++) {
		const tok = scanTokens[i + len];
		if (tok === undefined)
			break;
		if (len % 2 === 0) {
			if (tok.s !== ',') {
				break;
			}
		}
		else {
			if (!isIdentifier(tok.s)) {
				break;
			}
		}
	}
	if (len % 2 === 0)
		len--;

	return len + 1;
}

export function removePtrStatements(scanTokens) {
	for (let i = scanTokens.length - 2; i >= 0; i--) {
		const len = getPtrStatementLength(scanTokens, i);
		if (len !== 0) {
			scanTokens.splice(i, len);
		}
	}
};