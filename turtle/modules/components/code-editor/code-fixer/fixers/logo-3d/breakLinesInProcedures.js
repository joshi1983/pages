import { insertIntoCode } from '../helpers/insertIntoCode.js';
import { LogoScanner } from '../../../../../parsing/LogoScanner.js';
import { StringBuffer } from '../../../../../StringBuffer.js';

function isPossibleProcedureName(s) {
	if (s.startsWith('"') || s.toLowerCase() === 'end' || s.toLowerCase() === 'to')
		return false;
	if (isValidParameter(s))
		return false;
	return true;
}

function isPossibleStartToProcedure(tokens, toIndex) {
	if (tokens[toIndex].s.toLowerCase() !== 'to')
		return false;
	if (toIndex + 1 >= tokens.length)
		return false;
	if (!isPossibleProcedureName(tokens[toIndex + 1].s.toLowerCase()))
		return false;
	return true;
}

function isValidParameter(s) {
	if (s.startsWith(':'))
		return true;
	return false;
}

function isProcedureEndOfInterest(tokens, index) {
	if (isValidParameter(tokens[index].s) ||
	tokens[index].s === '\n' ||
	tokens[index].s.indexOf('\n') !== -1)
		return false;
	if (isPossibleProcedureName(tokens[index].s) &&
	tokens[index - 1].s.toLowerCase() === 'to')
		return false;
	let lineIndex1 = tokens[index].lineIndex;
	let i;
	for (i = index - 1; i > 1; i--) {
		const token = tokens[i];
		if (!isValidParameter(token.s)) {
			if (isPossibleProcedureName(token.s))
				break;
			else
				return false;
		}
	}
	i--;
	if (tokens[i].s.toLowerCase() !== 'to')
		return false;
	if (tokens[i].lineIndex === lineIndex1)
		return true;
	return false;
}

export function breakLinesInProcedures(code) {
	const scanTokens = LogoScanner.scan(code);
	const newBreaks = [];
	for (let i = 2; i < scanTokens.length; i++) {
		if (isProcedureEndOfInterest(scanTokens, i)) {
			const tok = scanTokens[i];
			newBreaks.push({
				'lineIndex': tok.lineIndex,
				'colIndex': tok.colIndex - tok.s.length + 1
			});
		}
	}
	return insertIntoCode(code, newBreaks, '\n');
};