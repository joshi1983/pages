import { getAllDescendentsAsArray } from
'../../../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getClosestOfType } from
'../../../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function isDeclarationFor(varName) {
	if (typeof varName !== 'string')
		throw new Error(`varName must be a string but found ${varName}`);

	return function(token) {
		if (token.type === ParseTreeTokenType.IDENTIFIER) {
			if (token.val !== varName)
				return false;

			const parent = token.parentNode;
			if (parent.type === ParseTreeTokenType.ARG_LIST) {
				const grandParent = parent.parentNode;
				return grandParent !== null && grandParent.type === ParseTreeTokenType.FUNC;
			}
			if (parent.type === ParseTreeTokenType.VAR) {
				return true;
			}
			if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
			parent.val === ':=' &&
			parent.children.indexOf(token) === 0)
				return true;
		}
		return false;
	};
}

function getVariableDeclaration(token, varName) {
	let tok = token;
	let prev;
	while (tok !== null) {
		if (tok.type === ParseTreeTokenType.FUNC) {
			// look for declarations in FUNC ARG_LIST's.
			const argList = tok.children.filter(t => t.type === ParseTreeTokenType.ARG_LIST)[0];
			if (argList !== undefined) {
				for (const paramToken of argList.children) {
					if (paramToken.type === ParseTreeTokenType.IDENTIFIER &&
					paramToken.val === varName) {
						return paramToken;
					}
				}
			}
		}
		else if (tok.type === ParseTreeTokenType.CODE_BLOCK && prev !== undefined) {
			for (let i = tok.children.indexOf(prev); i >= 0; i--) {
				const child = tok.children[i];
				const tokens = getAllDescendentsAsArray(child);
				tokens.push(child);
				const declarations = tokens.
					filter(isDeclarationFor(varName));
				if (declarations.length !== 0)
					return declarations[0];
			}
		}
		prev = tok;
		tok = tok.parentNode;
	}	
}

export function getMakeCommandFor(token, varName) {
	if (typeof varName !== 'string')
		throw new Error(`varName must be ${varName}`);

	const declaration = getVariableDeclaration(token, varName);
	if (declaration === undefined)
		return 'make';
	const func = getClosestOfType(declaration, ParseTreeTokenType.FUNC);
	if (func === null)
		return 'make';
	else
		return 'localmake';
};