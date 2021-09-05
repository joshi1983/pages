import { createFunctionCallWithFirstArgument } from
'./createFunctionCallWithFirstArgument.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processValueLiteral(prev, next) {
	if (prev.type === ParseTreeTokenType.IDENTIFIER) {
		createFunctionCallWithFirstArgument(prev, next);
		return next.parentNode;
	}
	prev.appendChild(next);
	return next;
};