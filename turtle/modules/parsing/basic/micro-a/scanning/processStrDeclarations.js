import { isIdentifier } from '../../qbasic/scanning/isIdentifier.js';
import { Token } from '../../../generic-parsing-utilities/Token.js';

function isOfInterest(scanTokens, i) {
	const token = scanTokens[i];
	if (token.s.toLowerCase() !== 'str')
		return false;
	const next = scanTokens[i + 1];
	if (next === undefined || !isIdentifier(next.s))
		return false;
	return true;
}

// Converts 'str' statements to 'let' where each variable is initially an empty string.
// Micro(A) BASIC's str statement declares identifiers as strings.
// Initializing each to an empty string passes some of that type information to translate to the QBASIC version.
export function processStrDeclarations(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		if (isOfInterest(scanTokens, i)) {
			const strToken = scanTokens[i];
			strToken.s = 'let';
			for (let j = 1; true; j++) {
				const tok = scanTokens[i + j];
				if (tok === undefined)
					break;
				if (j % 2 === 0 && tok.s !== ',')
					break;
				if (j % 2 === 1) {
					if (!isIdentifier(tok.s))
						break;
					const assignToken = new Token('=', tok.colIndex + 1, tok.lineIndex);
					const stringLiteralToken = new Token('""', tok.colIndex + 1, tok.lineIndex);
					scanTokens.splice(i + j + 1, 0, assignToken, stringLiteralToken);
					j += 2; // skip the newly added tokens.
				}
			}
		}
	}
};