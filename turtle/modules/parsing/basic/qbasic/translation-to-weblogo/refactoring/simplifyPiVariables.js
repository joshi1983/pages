import { evaluateToken } from
'../../evaluation/evaluateToken.js';
import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { isNumber } from
'../../../../../isNumber.js';
import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const declarationTypes = new Set([
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.LET
]);

function isDeclarationOfNoInterest(token) {
	const parent = token.parentNode;
	if (!shouldRemoveDeclaration(token))
		return true;

	return false;
}

function isDeclaringIdentifier(token) {
	const parent = token.parentNode;
	if (declarationTypes.has(parent.type))
		return true;

	if ((parent.type !== ParseTreeTokenType.ASSIGNMENT &&
	parent.type !== ParseTreeTokenType.BINARY_OPERATOR) ||
	parent.val !== '=' ||
	parent.children[0] !== token)
		return false;

	const gParent = parent.parentNode;
	if (declarationTypes.has(gParent.type) ||
	gParent.type === ParseTreeTokenType.TREE_ROOT ||
	gParent.type === ParseTreeTokenType.CODE_BLOCK)
		return true;

	return false;
}

function shouldReplacePiIdentifiers(pis) {
	const declarations = pis.filter(isDeclaringIdentifier);
	if (declarations.length === 0)
		return false;

	if (declarations.some(isDeclarationOfNoInterest))
		return false;

	return true;
}

function shouldConvertTo_PIFunctionCall(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.FUNCTION_CALL ||
	declarationTypes.has(parent.type) ||
	parent.type === ParseTreeTokenType.FUNCTION ||
	parent.type === ParseTreeTokenType.SUB)
		return false;

	if ((parent.type === ParseTreeTokenType.ASSIGNMENT ||
	parent.type === ParseTreeTokenType.BINARY_OPERATOR) &&
	parent.children[0] === token &&
	parent.val === '=')
		return false;

	if (parent.type === ParseTreeTokenType.ARG_LIST) {
		const gParent = parent.parentNode;
		if (gParent.type === ParseTreeTokenType.FUNCTION ||
		gParent.type === ParseTreeTokenType.SUB)
			return false;
				// for example, sub p(pi)
	}
	return true;
}

function shouldRemoveDeclaration(token) {
	if (!isDeclaringIdentifier(token))
		return false;

	const parent = token.parentNode;
	const valueSibling = parent.children[1];
	const val = evaluateToken(valueSibling);
	if (!isNumber(val) || Math.abs(Math.PI - val) > 0.01)
		return false; // for example, pi = 100
		// if the pi is being assigned something very different from 3.1415...
		// it is not a declaration to be removed.

	const grandparent = parent.parentNode;
	if (!declarationTypes.has(grandparent.type) &&
	grandparent.type !== ParseTreeTokenType.TREE_ROOT &&
	grandparent.type !== ParseTreeTokenType.CODE_BLOCK)
		return false;

	return true;
}

function isVariableReferenceOfInterest(token) {
	if (shouldConvertTo_PIFunctionCall(token))
		return true;
	if (shouldRemoveDeclaration(token))
		return true;
	return false;
}

export function simplifyPiVariables(root) {
	const pis = getDescendentsOfType(root, ParseTreeTokenType.IDENTIFIER).
		filter(t => t.val.toLowerCase() === 'pi');
	if (shouldReplacePiIdentifiers(pis)) {
		const piIdentifiers = pis.filter(isVariableReferenceOfInterest);
		piIdentifiers.forEach(function(id) {
			const parent = id.parentNode;
			if (shouldConvertTo_PIFunctionCall(id)) {
				id.val = '_PI';
				const functionCall = new ParseTreeToken(null, id.lineIndex, id.colIndex,
					ParseTreeTokenType.FUNCTION_CALL);
				const argList = new ParseTreeToken(null, id.lineIndex, id.colIndex,
					ParseTreeTokenType.ARG_LIST);
				parent.replaceChild(id, functionCall);
				id.remove();
				functionCall.appendChild(id);
				functionCall.appendChild(argList);
			}
			else if (shouldRemoveDeclaration(id)) {
				if (parent.type === ParseTreeTokenType.ASSIGNMENT ||
				parent.type === ParseTreeTokenType.BINARY_OPERATOR) {
					const grandparent = parent.parentNode;
					id.remove();
					const afterParent = parent.getNextSibling();
					if (afterParent !== null &&
					afterParent.type === ParseTreeTokenType.COMMA)
						afterParent.remove();
					parent.remove();
					if (grandparent.children.length === 0 &&
					declarationTypes.has(grandparent.type)) {
						grandparent.remove();
					}
				}
			}
		});
	}
};
