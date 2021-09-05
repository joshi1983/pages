import { getIndexToken } from './operators/getIndexToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from
'./processToken.js';

export function processExpressionIndexExpressionReadExpression(token, result, settings) {
	const children = token.children;
	const firstChild = children[0];
	const secondChild = children[1];
	const indexToken = getIndexToken(secondChild);
	if (indexToken === undefined)
		return;
	result.trimRight();
	result.append(` ( item `);
	if (indexToken.type === ParseTreeTokenType.NUMBER_LITERAL) {
		const indexVal = 1 + parseInt(indexToken.val);
		result.append('' + indexVal);
	}
	else {
		result.append(`1 + `);
		processToken(indexToken, result, settings);
	}
	processToken(firstChild, result, settings);
	result.trimRight();
	result.append(` ) `);
};