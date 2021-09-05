import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

export function processExpressionDot(token, result, cachedParseTree, settings) {
	const children = token.children;
	if (children.length === 2) {
		const second = children[1];
		if (second.type === ParseTreeTokenType.DOT &&
		second.children.length === 1) {
			processToken(second.children[0], result, cachedParseTree, settings);
			return;
		}
	}
	result.appendChild('\n; Unable to process EXPRESSION_DOT.  Manual translation required here\n');
};