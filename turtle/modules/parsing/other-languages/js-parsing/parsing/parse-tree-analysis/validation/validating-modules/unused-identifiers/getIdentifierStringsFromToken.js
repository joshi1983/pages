import { getIdentifierStringsFromClass } from './getIdentifierStringsFromClass.js';
import { getIdentifierStringsFromImport } from './getIdentifierStringsFromImport.js';
import { getIdentifierStringsFromVariableDeclaration } from './getIdentifierStringsFromVariableDeclaration.js';
import { getIdentifierStringsFromFunction } from './getIdentifierStringsFromFunction.js';
import { ParseTreeTokenType } from '../../../../../ParseTreeTokenType.js';

const getIdentifiersMap = new Map([
	[ParseTreeTokenType.CLASS, getIdentifierStringsFromClass],
	[ParseTreeTokenType.CONST, getIdentifierStringsFromVariableDeclaration],
	[ParseTreeTokenType.FUNCTION, getIdentifierStringsFromFunction],
	[ParseTreeTokenType.IMPORT, getIdentifierStringsFromImport],
	[ParseTreeTokenType.LET, getIdentifierStringsFromVariableDeclaration],
	[ParseTreeTokenType.VAR, getIdentifierStringsFromVariableDeclaration]
]);

export function getIdentifierStringsFromToken(token) {
	const getIdentifiersFunc = getIdentifiersMap.get(token.type);
	if (getIdentifiersFunc === undefined)
		throw new Error(`Unable to get identifiers from a token of type ${ParseTreeTokenType.getNameFor(token.type)} which has the type number ${token.type}`);
	return getIdentifiersFunc(token);
};