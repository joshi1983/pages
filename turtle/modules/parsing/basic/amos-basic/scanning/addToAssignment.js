import { isIdentifier } from '../../qbasic/scanning/isIdentifier.js';
import { Token } from '../../../Token.js';

function isAddOfInterest(scanTokens, i) {
	const tok = scanTokens[i];
	if (tok.s.toLowerCase() !== 'add')
		return false;
	if (i > scanTokens.length - 2)
		return false;
	const varNameToken = scanTokens[i + 1];
	if (!isIdentifier(varNameToken.s))
		return false;

	const commaToken = scanTokens[i + 2];
	if (commaToken.s !== ',')
		return false;

	const lookaheadToken = scanTokens[i + 4];
	if (lookaheadToken !== undefined && lookaheadToken.s === ',' && lookaheadToken.lineIndex === tok.lineIndex)
		return false;

	return true;
}

/*
convertas statements like add x,2
to
	x = x + 2
*/
export function addToAssignment(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		if (isAddOfInterest(scanTokens, i)) {
			const addTok = scanTokens[i];
			const varToken = scanTokens[i + 1];
			const commaToken = scanTokens[i + 2];
			const varName = varToken.s;
			addTok.s = varToken.s;
			varToken.s = '=';
			commaToken.s = varName;
			scanTokens.splice(i + 3, 0, new Token('+', commaToken.colIndex + 1, commaToken.lineIndex));
		}
	}
};