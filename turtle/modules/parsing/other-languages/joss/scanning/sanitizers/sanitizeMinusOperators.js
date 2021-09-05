import { isIdentifier } from '../isIdentifier.js';
import { isNum } from
'../../../../parse-tree-analysis/command-data-types/isNum.js';
import { isNumberLiteral } from '../isNumberLiteral.js';
import { MigrationInfo } from
'../../MigrationInfo.js';
import { Token } from
'../../../../Token.js';

const previousValuesIndicatingSplitMinus = new Set([
	')', ']', '-'
]);
const afterValuesIndicatingNotToSplitMinus = new Set([
	',', '.', ':', ';', ')', ']'
]);

function isOfInterest(scanTokens, i) {
	const token = scanTokens[i];
	if (i === 0 || token.s[0] !== '-' ||
	token.s === '-')
		return false;
		
	const next = scanTokens[i + 1];
	if (next !== undefined) {
		if (afterValuesIndicatingNotToSplitMinus.has(next.s))
			return false;
	}

	const prevS = scanTokens[i - 1].s;
	if (isNumberLiteral(prevS) ||
	previousValuesIndicatingSplitMinus.has(prevS))
		return true;

	if (isIdentifier(prevS)) {
		const info = MigrationInfo.getFunctionInfo(prevS);
		if (info !== undefined) {
			if (info.returnTypes === null ||
			(info.args !== undefined && info.args.length !== 0))
				return false;

			if (isNum(info.returnTypes))
				return true;

			if (info.returnTypes !== undefined)
				return false;
		}

		return true;
	}

	return false;
}

export function sanitizeMinusOperators(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		if (isOfInterest(scanTokens, i)) {
			const token = scanTokens[i];
			const s = token.s;
			const colIndex = Math.max(0, token.colIndex - token.s.length + 1);
			const newToken = new Token('-', colIndex, token.lineIndex);
			scanTokens.splice(i, 0, newToken);
			token.s = s.substring(1);
		}
	}
};