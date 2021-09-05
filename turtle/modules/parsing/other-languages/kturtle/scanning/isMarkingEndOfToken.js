import { isCompleteKTurtleVersion } from './isCompleteKTurtleVersion.js';
import { isInvalidVariableReferenceCharacter } from './isInvalidVariableReferenceCharacter.js';
import { isStartOfKTurtleVersion } from './isStartOfKTurtleVersion.js';
import { isStartOfNumberLiteral } from './isStartOfNumberLiteral.js';

const longOperators = new Set([
'<=', '>=', '!=', '=='
]);
const singleCharOperators = new Set([
'<', '>', '=', '*', '/', '+', '-', '^'
]);

export function isMarkingEndOfToken(s, nextChar) {
	if (s === '@(')
		return true;
	if (s.startsWith('$') && isInvalidVariableReferenceCharacter(nextChar))
		return true;
	if (longOperators.has(s))
		return true;
	if (s.length === 1) {
		if (longOperators.has(s + nextChar))
			return false;
		if (singleCharOperators.has(s))
			return true;
		if (s === ',' && (nextChar >= '0' && nextChar <= '9'))
			return true;
	}
	if (isCompleteKTurtleVersion(s) && !isStartOfKTurtleVersion(s + nextChar))
		return true;
	else if (isStartOfKTurtleVersion(s + nextChar))
		return false;
	if (singleCharOperators.has(nextChar))
		return true;
	if (s !== '' && isStartOfNumberLiteral(s) && !isStartOfNumberLiteral(s + nextChar))
		return true;
	return false;
};