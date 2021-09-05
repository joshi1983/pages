import { hasNoChildrenValueToken } from
'./hasNoChildrenValueToken.js';
import { QBasicOperators } from
'../../../qbasic/QBasicOperators.js';
import { Token } from
'../../../../generic-parsing-utilities/Token.js';

function getIndexOfParameterListEnd(scanTokens, startIndex) {
	if (!(scanTokens instanceof Array))
		throw new Error(`scanTokens must be an Array but found ${scanTokens}`);
	if (!Number.isInteger(startIndex))
		throw new Error(`startIndex must be an integer but found ${startIndex}`);
	const minIndex = startIndex + 5;
	if (minIndex >= scanTokens.length)
		return -1; // indicate index not found.

	const maxIndex = minIndex + 2;
	const startToken = scanTokens[startIndex - 1];
	let i;
	let internalIndex = 0;
	for (i = startIndex; true; i++) {
		const tok = scanTokens[i];
		if (tok === undefined || tok.lineIndex !== startToken.lineIndex)
			break;
		if (internalIndex % 2 === 0) {
			if (!hasNoChildrenValueToken(tok.s))
				return -1;
		}
		else {
			// comma expected
			if (tok.s !== ',')
				return -1;
		}
		if (i === maxIndex)
			break;
		internalIndex++;
	}
	if (i < minIndex)
		return -1;
	const next = scanTokens[i + 1];
	if (next !== undefined && next.lineIndex === startToken.lineIndex) {
		if (next.s === ',') // , indicators more parameters than expected.
			return -1;
		const operatorInfo = QBasicOperators.getOperatorInfo(next.s);
		if (operatorInfo !== undefined) {
			// an operator will complicate the last operator beyond what processSimpleLineCases
			// can handle correctly.
			return -1;
		}
	}
	return i;
}

/*
translates some calls to the line subroutine from Commodore Basic to QBasic.
This works only for cases where the parameters are single values.
This does not work if any parameter is an expression.

Since the QBASIC scanner and translater generally expect valid QBASIC code as input,
we are translating what we can here.
The more complex cases where parameters are evaluated expressions, some other code will have to translate
the other cases after the code is parsed as QBASIC.
*/
export function processSimpleLineCases(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const lineToken = scanTokens[i];
		if (lineToken.s.toLowerCase() === 'line') {
			const indexOfParameterListEnd = getIndexOfParameterListEnd(scanTokens, i + 1);
			if (indexOfParameterListEnd !== -1) {
				const tokens = scanTokens.slice(i + 1, indexOfParameterListEnd);
				const oldLen = tokens.length;
				const y1Token = tokens[2];
				const middleComma = tokens[3];
				const x2Token = tokens[4];
				const y2Token = tokens[6];
				tokens.splice(0, 0, new Token('(', lineToken.colIndex + 1, lineToken.lineIndex));
				// tokens are now: 0:(, 1:num, 2:comma, 3:num, 4:comma

				tokens.splice(4, 0, new Token(')', y1Token.colIndex + 1, y1Token.lineIndex));
				// tokens are now: .. 3:num, 4:), 5:comma

				middleComma.s = '-'; // the hyphen between points in QBasic
				// tokens are now: 4:), 5:-, 6:num, 7:comma

				tokens.splice(6, 0, new Token('(', x2Token.colIndex - 1, x2Token.lineIndex));
				// tokens are now: 5:-, 6:(, 7:num, 8:comma

				tokens.splice(10, 0, new Token(')', y2Token.colIndex + 1, y2Token.lineIndex))

				scanTokens.splice(i + 1, oldLen, ...tokens);
			}
		}
	}
};