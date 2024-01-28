import { adjustUnaryOperator } from './adjustUnaryOperator.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const adjusterMap = new Map([
	[ParseTreeTokenType.UNARY_OPERATOR, adjustUnaryOperator]
]);

export function adjustToken(token) {
	const adjuster = adjusterMap.get(token.type);
	if (adjuster !== undefined)
		return adjuster(token);
	return token;
};