import { getInScopeDeclaration } from
'./getInScopeDeclaration.js';
import { isPossibleVariableRead } from
'./isPossibleVariableRead.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { typesTokenToString } from
'../typesTokenToString.js';

function isVariableDeclaration(token, tokenToDataTypes) {
	return variableDeclarationToTypesString(token, tokenToDataTypes) !== undefined;
}

function variableDeclarationToTypesString(token, tokenToDataTypes) {
	if (typeof token !== 'object')
		throw new Error(`token must be an object but found ${token}`);

	const child = token.children[0];
	if (child !== undefined && child.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION) {
		return typesTokenToString(child).trim();
	}
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
		const pChildren = parent.children;
		if (pChildren.indexOf(token) === 0 && pChildren.length === 2) {
			const rightOperand = pChildren[1];
			const rightTypes = tokenToDataTypes.get(rightOperand);
			return rightTypes;
		}
	}
}

export function getDataTypesFromVariableReferences(tokens, result) {
	if (tokens instanceof Set)
		tokens = Array.from(tokens);
	const identifiers = tokens.filter(t => t.type === ParseTreeTokenType.IDENTIFIER && isPossibleVariableRead(t));
	const declarations = identifiers.filter(token => isVariableDeclaration(token, result));
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
		if (!isVariableDeclaration(identifier, result)) {
			const decs = declarationNameMap.get(identifier.val);
			if (decs !== undefined) {
				const dec = getInScopeDeclaration(identifier, decs);
				if (dec !== undefined) {
					const types = variableDeclarationToTypesString(dec, result);
					if (types !== undefined)
						result.set(identifier, types);
				}
			}
		}
	}
};