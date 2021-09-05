import { processToken } from
'../processToken.js';

const intTypes = new Set([
	'int', 'int8', 'int16', 'int32', 'int64',
	'uint', 'uint8', 'uint16', 'uint32', 'uint64'
]);

function shouldUseIntegerDivision(left, right, settings) {
	const tokenDataTypes = settings.tokenDataTypes;
	const leftTypes = tokenDataTypes.get(left);
	const rightTypes = tokenDataTypes.get(right);
	return intTypes.has(leftTypes) && intTypes.has(rightTypes);
}

export function processDivision(token, result, settings) {
	const children = token.children;
	const leftOperand = children[0];
	const rightOperand = children[1];
	result.append(' ( ');
	if (shouldUseIntegerDivision(leftOperand, rightOperand, settings)) {
		result.append(' floor ');
	}
	result.append(' ( ');
	processToken(leftOperand, result, settings);
	result.append(' ) / ( ');
	processToken(rightOperand, result, settings);
	result.append(' )) ');
};