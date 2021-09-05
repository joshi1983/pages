import { isCompleteNumberLiteral } from
'../qbasic/scanning/isCompleteNumberLiteral.js';
import { QBasicInternalFunctions } from
'../qbasic/QBasicInternalFunctions.js';
import { Token } from
'../../generic-parsing-utilities/Token.js';

function hasNoChildrenValueToken(s) {
	const sLower = s.toLowerCase();
	return isCompleteNumberLiteral(s) ||
		sLower === 'true' || sLower === 'false';
}

function getParameterListEndIndex(scanTokens, startIndex, functionInfo) {
	let argCount = functionInfo.argCount;
	if (argCount === undefined) {
		if (functionInfo.args !== undefined)
			argCount = {
				'min': functionInfo.args.length,
				'max': functionInfo.args.length
			};
		else if (functionInfo.to !== undefined) {
			const qbInfo = QBasicInternalFunctions.getFunctionInfo(functionInfo.to);
			argCount = qbInfo.argCount;
		}
	}
	if (argCount === undefined || argCount.max === undefined || argCount.min === undefined)
		return -1;

	const minIndex = startIndex + Math.max(0, (argCount.min * 2) - 1);
	if (minIndex >= scanTokens.length)
		return -1;
	const maxIndex = Math.min(scanTokens.length - 1, minIndex + (argCount.max - argCount.min) * 2);
	for (let i = startIndex; i <= maxIndex; i++) {
		const tok = scanTokens[i];
		if ((i - startIndex) % 2 === 0) {
			if (!hasNoChildrenValueToken(tok.s))
				return -1;
		}
		else {
			if (tok.s !== ',')
				return -1;
			if (i === maxIndex)
				return -1; // a parameter list should not end with a comma.
		}
	}
	
	return maxIndex;
}

export function wrapParametersInCurvedBrackets(scanTokens, startIndex, functionInfo) {
	const endIndex = getParameterListEndIndex(scanTokens, startIndex, functionInfo);
	if (endIndex !== -1) {
		const firstToken = scanTokens[startIndex];
		const lastToken = scanTokens[endIndex];
		scanTokens.splice(startIndex, 0, new Token('(', firstToken.colIndex - 1, firstToken.lineIndex));
		const closingBracket = new Token(')', lastToken.colIndex + 1, lastToken.lineIndex);
		scanTokens.splice(endIndex + 2, 0, closingBracket);
	}
};