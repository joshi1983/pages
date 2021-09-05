import { getInScopeDeclaration } from
'./getInScopeDeclaration.js';
import { isPossibleVariableRead } from
'./isPossibleVariableRead.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function isVariableDeclaration(token) {
	return variableDeclarationToTypesString(token) !== undefined;
}

function variableDeclarationToTypesString(token) {
	if (typeof token !== 'object')
		throw new Error(`token must be an object but found ${token}`);

	const child = token.children[0];
	if (child !== undefined && child.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION) {
		let result = '';
		for (let tok = child.children[0]; tok !== undefined &&
		typeof tok.val === 'string'; tok = tok.children[0]) {
			result += tok.val + ' ';
		}
		return result.trim();
	}
}

export function getDataTypesFromVariableReferences(tokens, result) {
	if (tokens instanceof Set)
		tokens = Array.from(tokens);
	const identifiers = tokens.filter(t => t.type === ParseTreeTokenType.IDENTIFIER && isPossibleVariableRead(t));
	const declarations = identifiers.filter(isVariableDeclaration);
	const declarationNameMap = new Map();
	for (const dec of declarations) {
		let decs = declarationNameMap.get(dec.val);
		if (decs === undefined) {
			decs = [];
			declarationNameMap.set(dec.val, decs);
		}
		decs.push(dec);
	}
	for (const identifier of identifiers) {
		if (!isVariableDeclaration(identifier)) {
			const decs = declarationNameMap.get(identifier.val);
			if (decs !== undefined) {
				const dec = getInScopeDeclaration(identifier, decs);
				if (dec !== undefined) {
					const types = variableDeclarationToTypesString(dec);
					result.set(identifier, types);
				}
			}
		}
	}
};