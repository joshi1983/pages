import { isNotToken } from './token-classifiers/isNotToken.js';
import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';

function getBooleanExpressionChild(token) {
	if (token.type === ParseTreeTokenType.FUNCTION_CALL)
		return token.children[1].children[1];
	return token.children[0];
}

export function optimizeBooleanExpression(booleanExpressionToken) {
	if (booleanExpressionToken.children.length === 0)
		return booleanExpressionToken;
	let continueLooping;
	do {
		continueLooping = false;
		if (isNotToken(booleanExpressionToken)) {
			const child = getBooleanExpressionChild(booleanExpressionToken);
			if (isNotToken(child)) {
				booleanExpressionToken = getBooleanExpressionChild(child);
				continueLooping = true;
			}
		}
	} while (continueLooping);
	if (isNotToken(booleanExpressionToken) &&
	booleanExpressionToken.type === ParseTreeTokenType.FUNCTION_CALL) {
		const argList = booleanExpressionToken.children[1];
		argList.val = '!';
		argList.type = ParseTreeTokenType.UNARY_OPERATOR;
		argList.removeChild(argList.children[0]);
		argList.removeChild(argList.children[1]);
		return argList;
	}
	return booleanExpressionToken;
};