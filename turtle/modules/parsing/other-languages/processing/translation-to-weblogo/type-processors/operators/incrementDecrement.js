import { processAssignmentPrefix } from './processAssignmentPrefix.js';
import { processReadExpression } from './processReadExpression.js';

function getVarNameToken(token) {
	if (token.children.length !== 0)
		return token.children[0];
	return token.parentNode;
}

export function incrementDecrement(token, result, settings) {
	const symbol = token.val[0];
	const children = token.children;
	const varNameToken = getVarNameToken(token);
	result.append(' ');
	processAssignmentPrefix(varNameToken, result, settings);
	result.append(' ');
	processReadExpression(varNameToken, result, settings);
	result.append(` ${symbol} 1`);
};