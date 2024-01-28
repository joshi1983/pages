import { evaluateLiteralToken } from './evaluateLiteralToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const ignoredTypes = new Set([
ParseTreeTokenType.COMMA,
ParseTreeTokenType.SQUARE_LEFT_BRACKET,
ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
]);

export function evaluateArrayLiteralToken(arrayToken) {
	const result = [];
	const children = arrayToken.children;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (!ignoredTypes.has(child.type)) {
			const evaluationResult = evaluateLiteralToken(child);
			if (evaluationResult === undefined)
				return; // indicate unable to evaluate
			result.push(evaluationResult);
		}
	}
	return result;
};