import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

export function getIndexToken(indexExpressionToken) {
	if (indexExpressionToken.type !== ParseTreeTokenType.INDEX_EXPRESSION)
		return;
	const children = indexExpressionToken.children;
	if (children.length > 1)
		return children[1];
};