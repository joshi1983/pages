import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function getForLoopVarName(forLoopToken) {
	if (forLoopToken.type !== ParseTreeTokenType.FOR_LOOP)
		throw new Error('forLoopToken must be a for loop token');
	const firstChild = forLoopToken.children[0];
	if (firstChild.type === ParseTreeTokenType.IDENTIFIER)
		return firstChild.val;
};