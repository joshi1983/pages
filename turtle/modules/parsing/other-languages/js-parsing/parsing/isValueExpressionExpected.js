import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const typesToExpectedValueIndexes = new Map([
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, [1]],
	[ParseTreeTokenType.BINARY_OPERATOR, [1]],
	[ParseTreeTokenType.UNARY_OPERATOR, [0]]
]);

export function isValueExpressionExpected(previousToken) {
	const indexes = typesToExpectedValueIndexes.get(previousToken.type);
	if (indexes !== undefined) {
		const index = previousToken.children.length;
		if (indexes.indexOf(index) !== -1)
			return true;
	}

	return false;
};