import { evaluateNumberLiteralString } from
'../../qbasic/evaluation/evaluateNumberLiteralString.js';
import { isComment } from
'../../qbasic/scanning/isComment.js';
import { isCompleteNumberLiteral } from
'../../qbasic/scanning/isCompleteNumberLiteral.js';

const piTypes = new Set([
	'double', 'float'
]);

function isCloseEnoughToPi(s) {
	if (!isCompleteNumberLiteral(s))
		return false;

	const val = evaluateNumberLiteralString(s);
	if (Math.round(val) !== 3)
		return false;
	return true;
}

function isPossibleAfterToken(scanTokens, index) {
	const afterToken = scanTokens[index];
	if (afterToken === undefined)
		return true;
	const lastToken = scanTokens[index - 1];
	if (lastToken.lineIndex !== afterToken.lineIndex)
		return true;
	if (lastToken.s !== ',' &&
	lastToken.s !== ':' &&
	!isComment(lastToken.s))
		return false;
	return true;
}

function getLenToRemove(scanTokens, varIndex) {
	const varToken = scanTokens[varIndex];
	if (varToken.s.toLowerCase() === 'pi') {
		const assignToken = scanTokens[varIndex + 1];
		if (assignToken.s !== '=')
			return 0;

		const numberToken = scanTokens[varIndex + 2];
		if (!isCloseEnoughToPi(numberToken.s))
			return 0;

		if (!isPossibleAfterToken(scanTokens, varIndex + 3))
			return 0;

		return 3;
	}
	if (varToken.s.toLowerCase() !== 'var')
		return 0;

	const piToken = scanTokens[varIndex + 1];
	if (piToken === undefined ||
	piToken.s.toLowerCase() === 'pi')
		return 0;

	const nextToken = scanTokens[varIndex + 2];
	if (nextToken === undefined)
		return 0;

	if (nextToken.s === '=') {
		// for example, var pi = 3.14152
		const numberLiteral = scanTokens[varIndex + 3];
		if (!isCloseEnoughToPi(numberLiteral.s))
			return 0;

		if (!isPossibleAfterToken(scanTokens, varIndex + 4))
			return 0;

		return 4;
	}
	else if (nextToken.s === ':') {
		const typeToken = scanTokens[varIndex + 4];
		if (!piTypes.has(typeToken.s.toLowerCase()))
			return 0;

		const assignToken = scanTokens[varIndex + 5];
		if (assignToken.s !== '=')
			return 0;

		const numToken = scanTokens[varIndex + 6];
		if (numToken === undefined)
			return 0;

		if (!isCloseEnoughToPi(numToken.s))
			return 0;

		if (!isPossibleAfterToken(scanTokens, varIndex + 7))
			return 0;
		return 7;
	}
	return 0;
}

export function removePiVariableAssignments(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const len = getLenToRemove(scanTokens, i);
		if (len > 0) {
			scanTokens.splice(i, len);
		}
	}
};