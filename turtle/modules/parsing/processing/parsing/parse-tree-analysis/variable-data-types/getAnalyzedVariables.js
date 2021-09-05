import { getClosestOfType } from
'../../../../generic-parsing-utilities/getClosestOfType.js';
import { getDataTypeString } from
'./getDataTypeString.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getSortedLastDescendentTokenOf } from
'../../../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { Variable } from
'./Variable.js';
import { VariableScope } from
'./VariableScope.js';

function declarationChildToVariableName(token) {
	if (token.type === ParseTreeTokenType.IDENTIFIER)
		return token.val;
	else if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	token.children.length !== 0)
		return declarationChildToVariableName(token.children[0]);
}

export function getAnalyzedVariables(cachedParseTree) {
	const declarations = getDescendentsOfType(cachedParseTree.root, ParseTreeTokenType.DECLARATION);
	const lastToken = getSortedLastDescendentTokenOf(cachedParseTree.root);
	const result = new Map();
	for (const declaration of declarations) {
		const typeString = getDataTypeString(declaration);
		const children = declaration.children;
		let isParameter = false;
		let toToken = lastToken;
		const methodToken = getClosestOfType(declaration, ParseTreeTokenType.METHOD);
		let method;
		if (methodToken !== null &&
		methodToken.children.length >= 2) {
			toToken = getSortedLastDescendentTokenOf(methodToken);
			method = cachedParseTree.methodTokenToMethod(methodToken);
		}
		const argList = getClosestOfType(declaration, ParseTreeTokenType.ARG_LIST);
		if (argList !== null && method !== null) {
			if (argList.parentNode === methodToken)
				isParameter = true;
		}
		for (let i = 1; i < children.length; i++) {
			const name = declarationChildToVariableName(children[i]);
			if (typeof name === 'string') {
				let variable = result.get(name);
				if (variable === undefined) {
					variable = new Variable(name);
					result.set(name, variable);
				}
				variable.addScope(new VariableScope(declaration, toToken,
					method, isParameter, typeString));
			}
		}
	}
	return result;
};