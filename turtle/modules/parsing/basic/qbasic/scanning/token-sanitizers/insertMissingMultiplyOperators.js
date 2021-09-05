import { isCompleteNumberLiteral } from '../isCompleteNumberLiteral.js';
import { isStrictIdentifier } from '../isStrictIdentifier.js';
import { QBasicInternalFunctions } from
'../../QBasicInternalFunctions.js';
import { Token } from
'../../../../Token.js';

function isNumericToken(token, customFunctionNames) {
	if (token === undefined)
		return false;
	if (isCompleteNumberLiteral(token.s))
		return true;
	return isStrictIdentifier(token.s);
}

function isAssignmentLine(scanTokens, i, customFunctionNames) {
	if (!Number.isInteger(i))
		throw new Error(`i must be an integer but found ${i}`);
	if (!(customFunctionNames instanceof Set))
		throw new Error(`customFunctionNames must be a Set but found ${customFunctionNames}`);

	const token = scanTokens[i];
	const lineIndex = token.lineIndex;
	let assignOperatorFound = false;
	let j = i - 1;
	for (; j >= 0; j--) {
		const tok = scanTokens[j];
		if (tok.lineIndex !== lineIndex)
			break;

		const lowerS = tok.s.toLowerCase();
		if (lowerS === ':') // simulated line break
			break;

		if (lowerS !== 'let' && lowerS !== 'const' &&
		(customFunctionNames.has(lowerS) ||
		QBasicInternalFunctions.getFunctionInfo(lowerS) !== undefined)
		) {
			return false;
			// not able to be sure the tokens are associated with an assignment
			// since they might be separate parameters to a custom function.
		}
		else if (lowerS === '=')
			assignOperatorFound = true;
	}
	return assignOperatorFound;
}

function isAdjacentTokensOfInterest(scanTokens, i, customFunctionNames) {
	if (!Number.isInteger(i))
		throw new Error(`i must be an integer but found ${i}`);
	if (!(customFunctionNames instanceof Set))
		throw new Error(`customFunctionNames must be a Set but found ${customFunctionNames}`);

	const first = scanTokens[i];
	const second = scanTokens[i + 1];
	if (!isNumericToken(first, customFunctionNames) ||
	!isNumericToken(second, customFunctionNames))
		return false;
	if (first.lineIndex !== second.lineIndex)
		return false;
	if (customFunctionNames.has(first.s.toLowerCase()))
		return false;
		// The custom function might return a number but
		// we're not sure if parameters are needed by the function.
		// Since we're not sure if the inserted * would create a problem,
		// we are not interested in this place.

	if (!isAssignmentLine(scanTokens, i, customFunctionNames))
		return false;

	return true;
}

export function insertMissingMultiplyOperators(scanTokens, customFunctionNames) {
	for (let i = 0; i < scanTokens.length; i++) {
		if (isAdjacentTokensOfInterest(scanTokens, i, customFunctionNames)) {
			const tok = scanTokens[i];
			scanTokens.splice(i + 1, 0, new Token('*', tok.colIndex + 1, tok.lineIndex));
			i++;
		}
	}
};