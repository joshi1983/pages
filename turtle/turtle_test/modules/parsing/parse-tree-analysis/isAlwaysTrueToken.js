import { evaluateToken } from './evaluateToken.js';

/*
Checks if the specified ParseTreeToken(token) corresponds with an expression that always evaluates to true.
*/
export function isAlwaysTrueToken(token, proceduresMap) {
	return evaluateToken(token, proceduresMap) === true;
};