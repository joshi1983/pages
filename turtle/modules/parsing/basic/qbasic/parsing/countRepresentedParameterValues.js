import { mightBeDataValue } from './parse-tree-analysis/variable-data-types/mightBeDataValue.js';

function countValuesForGet(tokens) {
	return countValuesForLine(tokens);
}

function countValuesForLine(tokens) {
	if (tokens.length === 0)
		return 0;
	const first = tokens[0];
	let result = 0;
	if (first.val === '-') {
		if (first.children.length === 2) {
			result = 4;
		}
		else if (first.children.length === 1)
			result = 2;
	}
	return result + countRemaining(tokens, 1);
}

function countRemaining(tokens, startIndex) {
	let result = 0;
	for (let i = startIndex; i < tokens.length; i++) {
		const token = tokens[i];
		if (token.val === ',' && (i === 0 ||
		tokens[i - 1].val === ','))
			result++;
		else if (mightBeDataValue(token))
			result++;
	}
	return result;
}

export function countRepresentedParameterValues(tokens, functionInfo) {
	if (functionInfo.primaryName === 'get')
		return countValuesForGet(tokens);
	if (functionInfo.primaryName === 'line')
		return countValuesForLine(tokens);
	return countRemaining(tokens, 0);
};