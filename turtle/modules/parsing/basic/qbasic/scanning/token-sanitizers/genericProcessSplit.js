import { Token } from
'../../../../generic-parsing-utilities/Token.js';

/*
Processes a split on the specified line, if it is safe to do so.
*/
export function genericProcessSplit(scanTokens, customFunctionNames, isPrefixOfInterest, split, 
startIndex, direction, optionalLineIndex, optionalIsDisqualifying, optionalIsQualifying) {
	if (!(customFunctionNames instanceof Set))
		throw new Error(`customFunctionNames must be a Set but found ${customFunctionNames}`);
	if (direction !== 1 && direction !== -1 && direction !== 0)
		throw new Error(`direction should either be 1, 0, or -1 but found ${direction}`);
	if (optionalIsDisqualifying !== undefined && typeof optionalIsDisqualifying !== 'function')
		throw new Error(`optionalIsDisqualifying must either be undefined or a function but found ${optionalIsDisqualifying}`);

	let lineIndex = optionalLineIndex;
	if (lineIndex === undefined) {
		const lineMarkerToken = scanTokens[startIndex - direction];
		if (lineMarkerToken === undefined)
			throw new Error(`A token at index ${i} was not found.  That token is needed to determine which line the process is applicable to. scanTokens.length = ${scanTokens.length}, startIndex=${startIndex}, direction=${direction}`);

		lineIndex = lineMarkerToken.lineIndex;
	}
	let isDisqualifying, isQualifying;
	if (optionalIsDisqualifying === undefined)
		isDisqualifying = function() {return false;};
	else
		isDisqualifying = optionalIsDisqualifying;
	if (optionalIsQualifying === undefined)
		isQualifying = function() {return false;};
	else
		isQualifying = optionalIsQualifying;
	if (direction === 0) {
		for (; startIndex >= 1; startIndex--) {
			const tok = scanTokens[startIndex - 1];
			if (tok.lineIndex !== lineIndex)
				break;
			if (tok.s === ':')
				break;
		}
		direction = 1;
	}
	let endIndex = -1;
	if (direction === 1)
		endIndex = scanTokens.length;
	let tokenToSplit, indexToSplit;
	let qualifying = optionalIsQualifying === undefined;
	for (let i = startIndex; i !== endIndex; i += direction) {
		const tok = scanTokens[i];
		if (tok.s === ':' || tok.lineIndex !== lineIndex) {
			break;
		}
		else if (!customFunctionNames.has(tok.s.toLowerCase()) &&
		isPrefixOfInterest(tok.s)) {
			if (tokenToSplit !== undefined)
				return; // what to split is ambiguous so do nothing.
			tokenToSplit = tok;
			indexToSplit = i;
		}
		else if (isDisqualifying(tok.s))
			return; // don't change anything.
		else if (isQualifying(tok.s)) {
			qualifying = true;
		}
	}
	if (qualifying && tokenToSplit !== undefined) {
		const oldS = tokenToSplit.s;
		const parts = split(tokenToSplit.s);
		const newTokens = [tokenToSplit];
		tokenToSplit.s = parts[0];
		tokenToSplit.colIndex -= oldS.length - tokenToSplit.s.length;
		let colIndex = tokenToSplit.colIndex;
		for (let i = 1; i < parts.length; i++) {
			const s = parts[i];
			colIndex += s.length;
			const tok = new Token(s, colIndex, lineIndex);
			newTokens.push(tok);
		}
		scanTokens.splice(indexToSplit, 1, ...newTokens);
	}
};