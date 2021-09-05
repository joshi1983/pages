import { Colour } from
'../../../../../Colour.js';
import { evaluateStringLiteralString } from
'../../../qbasic/evaluation/evaluateStringLiteralString.js';
import { ParseTreeTokenType } from
'../../../qbasic/ParseTreeTokenType.js';

const parentTypesNotUsingColor = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.UNARY_OPERATOR
]);

const functionNamesUsingColor = new Set([
	'clg', 'color'
]);

// data copied and adapted from:
// https://doc.basic256.org/doku.php?id=en:rgb
const basic256Colors = new Map([
	['black', '#000'],
	['blue', '#00f'],
	['cyan', '#0ff'],
	['darkblue', '#000080'],
	['darkcyan', '#008080'],
	['darkgreen', '#008000'],
	['darkgrey', '#808080'],
	['darkorange', '#b03d00'],
	['darkpurple', '#800080'],
	['darkred', '#800'],
	['darkyellow', '#808000'],
	['green', '#0f0'],
	['grey', '#a4a4a4'],
	['orange', '#f60'],
	['purple', '#f0f'],
	['red', '#f00'],
	['white', '#fff'],
	['yellow', '#ff0'],
]);

export function shouldBeProcessedAsColorName(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER &&
	token.type !== ParseTreeTokenType.STRING_LITERAL)
		return false;

	let s = token.val.toLowerCase();
	if (token.type === ParseTreeTokenType.STRING_LITERAL)
		s = evaluateStringLiteralString(s);
	if (!basic256Colors.has(s) && s !== 'clear')
		return false;
	const prev = token.getPreviousSibling();
	const parent = token.parentNode;
	if (prev === null) {
		if (parent.lineIndex !== token.lineIndex)
			return false;
				// if the identifier is not on the same line as a function or subroutine 
				// that might use a colour value, don't treat it as a colour.
	}
	if (token.type === ParseTreeTokenType.STRING_LITERAL) {
		// A string literal like "clear" or "red" might just be intended to 
		// remain as a string of characters.
		// We want some more strict checks for string literals to be more confident that
		// the value is meant to be interpreted as a colour instead of a string.
		// For example, with code like: 
		// print "clear"
		// The word "clear" should get printed.  'transparent' should not get printed.

		if (parentTypesNotUsingColor.has(parent.type))
			return false; // For example, "clear" + " weather" should not become transparent + " weather"

		if (parent.type === ParseTreeTokenType.ARG_LIST) {
			const grandParent = parent.parentNode;
			if (grandParent.type === ParseTreeTokenType.FUNCTION_CALL) {
				const nameToken = grandParent.children[0];
				const name = nameToken.val;
				if (typeof name === 'string') {
					if (!functionNamesUsingColor.has(name.toLowerCase()))
						return false;
				}
				else
					return false;
			}
		}
	}
	return true;
};

export function processColorName(token, result, options) {
	let lowerCaseName = token.val.toLowerCase();
	if (token.type === ParseTreeTokenType.STRING_LITERAL)
		lowerCaseName = evaluateStringLiteralString(lowerCaseName);
	let hex = basic256Colors.get(lowerCaseName);
	if (hex !== undefined) {
		const colorInfo = Colour.getColourInfoByName(lowerCaseName);
		if (colorInfo !== undefined) {
			const c1 = new Colour(hex);
			const c2 = new Colour(lowerCaseName);
			if (c1.equals(c2))
				hex = lowerCaseName;
				// if WebLogo supports the same colour name and it is exactly the same Red, green, blue values,
				// use the name instead of a hexadecimal representation.
				// The name should be easier to understand in code.
		}
		result.append(` "${hex} `);
	}
	else
		result.append(' transparent ');
}