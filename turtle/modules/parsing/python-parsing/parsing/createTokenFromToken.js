import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';

export function createTokenFromToken(val, token, type) {
	if (typeof token !== 'object')
		throw new Error(`token must be an object but found ${token}`);
	if (!Number.isInteger(type))
		throw new Error(`type must be an integer but found ${type}`);

	const result = new ParseTreeToken(val, token.lineIndex, token.colIndex, type);
	result.indentLevel = token.indentLevel;
	return result;
};