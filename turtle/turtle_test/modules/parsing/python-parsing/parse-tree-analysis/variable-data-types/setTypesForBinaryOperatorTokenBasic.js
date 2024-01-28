import { DataTypes } from '../../data-types/DataTypes.js';

/*
This information isn't perfect but it should be
accurate enough for most cases of translation.

This isn't accurate when Python's operator overloading is used
which could lead to other returning data types from these operators.
Some examples of operator overloading are listed here:
https://www.geeksforgeeks.org/operator-overloading-in-python/
*/
const symbolToTypeMap = new Map([
	['and', 'bool'],
	['or', 'bool'],
	['not', 'bool'],
	['>', 'bool'],
	['<', 'bool'],
	['>=', 'bool'],
	['<=', 'bool'],
	['==', 'bool'],
	['*', 'list|num|string'],
	['**', 'num'],
	['/', 'num'],
	['+', 'list|num|string'],
	['-', 'num'],
	['//', 'num'],
	['%', 'num|string'],
]);

for (const [key, value] of symbolToTypeMap) {
	symbolToTypeMap.set(key, new DataTypes(value));
}

export function setTypesForBinaryOperatorTokenBasic(token, tokenTypes) {
	if (token.type !== ParseTreeTokenType.BINARY_OPERATOR)
		return;
	const types = symbolToTypeMap.get(token.val);
	if (types !== undefined)
		tokenTypes.set(token, types);
};