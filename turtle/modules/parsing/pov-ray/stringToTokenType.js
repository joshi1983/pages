import { isIdentifier } from './scanning/isIdentifier.js';
import { isNumberLiteral } from './scanning/isNumberLiteral.js';
import { mightBeDirective } from './scanning/mightBeDirective.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { PovRayCommand } from './PovRayCommand.js';

const sToTypeMap = new Map([
	['<', ParseTreeTokenType.ANGLE_LEFT_BRACKET],
	['>', ParseTreeTokenType.ANGLE_RIGHT_BRACKET],
	['+', ParseTreeTokenType.BINARY_OPERATOR],
	['*', ParseTreeTokenType.BINARY_OPERATOR],
	['/', ParseTreeTokenType.BINARY_OPERATOR],
	['-', ParseTreeTokenType.BINARY_OPERATOR],
	['=', ParseTreeTokenType.BINARY_OPERATOR],
	['<=', ParseTreeTokenType.BINARY_OPERATOR],
	['>=', ParseTreeTokenType.BINARY_OPERATOR],
	['!=', ParseTreeTokenType.BINARY_OPERATOR],
	['|', ParseTreeTokenType.BINARY_OPERATOR],
	['&', ParseTreeTokenType.BINARY_OPERATOR],
	[':', ParseTreeTokenType.COLON],
	[',', ParseTreeTokenType.COMMA],
	['{', ParseTreeTokenType.CURLY_LEFT_BRACKET],
	['}', ParseTreeTokenType.CURLY_RIGHT_BRACKET],
	['(', ParseTreeTokenType.CURVED_LEFT_BRACKET],
	[')', ParseTreeTokenType.CURVED_RIGHT_BRACKET],
	['.', ParseTreeTokenType.DOT],
	['?', ParseTreeTokenType.QUESTION_MARK],
	['[', ParseTreeTokenType.SQUARE_LEFT_BRACKET],
	[']', ParseTreeTokenType.SQUARE_RIGHT_BRACKET],
	[';', ParseTreeTokenType.SEMICOLON],
	['!', ParseTreeTokenType.UNARY_OPERATOR],
	['#break', ParseTreeTokenType.BREAK],
	['#case', ParseTreeTokenType.CASE],
	['#declare', ParseTreeTokenType.DECLARE],
	['#else', ParseTreeTokenType.ELSE],
	['#end', ParseTreeTokenType.END],
	['#if', ParseTreeTokenType.IF],
	['#ifdef', ParseTreeTokenType.IFDEF],
	['#ifndef', ParseTreeTokenType.IFNDEF],
	['#local', ParseTreeTokenType.LOCAL],
	['#macro', ParseTreeTokenType.MACRO],
	['#range', ParseTreeTokenType.RANGE],
	['#switch', ParseTreeTokenType.SWITCH],
	['#while', ParseTreeTokenType.WHILE],
	['array', ParseTreeTokenType.ARRAY],
	['dictionary', ParseTreeTokenType.DICTIONARY],
	['function', ParseTreeTokenType.FUNCTION],
	['mixed', ParseTreeTokenType.MIXED],
]);

const specialValues = Array.from(sToTypeMap.keys());

export { specialValues };

export function stringToTokenType(s) {
	let type = sToTypeMap.get(s);
	if (type !== undefined)
		return type;
	if (s.startsWith('//'))
		return ParseTreeTokenType.SINGLE_LINE_COMMENT;
	if (s.startsWith('/*'))
		return ParseTreeTokenType.MULTI_LINE_COMMENT;
	if (isNumberLiteral(s))
		return ParseTreeTokenType.NUMBER_LITERAL;
	if (s[0] === '"')
		return ParseTreeTokenType.STRING_LITERAL;
	if (mightBeDirective(s) || PovRayCommand.getCommandInfo(s) !== undefined)
		return ParseTreeTokenType.PARAMETERIZED_GROUP;
	if (isIdentifier(s))
		return ParseTreeTokenType.IDENTIFIER;
	return ParseTreeTokenType.UNMATCHED;
};