import { evaluateToken } from '../../../parsing/parse-tree-analysis/variable-data-types/evaluation/evaluateToken.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function evaluateTokensBasic(cachedParseTree) {
	const result = new Map();
	const tokens = cachedParseTree.getTokensByTypes([ParseTreeTokenType.BINARY_OPERATOR,
		ParseTreeTokenType.BOOLEAN_LITERAL,
		ParseTreeTokenType.NUMBER_LITERAL, ParseTreeTokenType.STRING_LITERAL]);
	for (const token of tokens) {
		const val = evaluateToken(token);
		if (val !== undefined) {
			result.set(token, val);
		}
	}
	return result;
};