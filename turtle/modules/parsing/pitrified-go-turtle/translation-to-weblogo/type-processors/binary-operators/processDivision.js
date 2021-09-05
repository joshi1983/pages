import { isIntegerType } from
'../../../parsing/parse-tree-analysis/isIntegerType.js';
import { processToken } from
'../processToken.js';

function shouldUseIntegerDivision(left, right, settings) {
	const tokenDataTypes = settings.tokenDataTypes;
	const leftTypes = tokenDataTypes.get(left);
	const rightTypes = tokenDataTypes.get(right);
	return isIntegerType(leftTypes) && isIntegerType(rightTypes);
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