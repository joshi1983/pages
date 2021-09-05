import { getClosestOfType } from
'../../../../../../generic-parsing-utilities/getClosestOfType.js';
import { getDescendentsOfTypes } from
'../../../../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { getTreeRoot } from
'../../../../../../generic-parsing-utilities/getTreeRoot.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

function isFormalArgList(token) {
	return token.type === ParseTreeTokenType.FORMAL_ARG_LIST;
}

function isArrayParameter(token, variableName) {
	// Usually there is no nesting of functions.
	// This loop handles functions/procedures within other functions/procedures anyway, though.
	while (token !== null) {
		if (token.type === ParseTreeTokenType.FUNCTION ||
		token.type === ParseTreeTokenType.PROCEDURE) {
			const formalArgList = token.children.filter(isFormalArgList)[0];
			if (formalArgList !== undefined) {
				const matchingArg = formalArgList.children.filter(a =>
				a.type === ParseTreeTokenType.IDENTIFIER &&
				a.children.length === 0 &&
				a.val.toLowerCase() === variableName)[0];
				if (matchingArg !== undefined) {
					const colon = matchingArg.getNextSibling();
					if (colon === null)
						return false;
					const dte = colon.getNextSibling();
					if (dte === null)
						return false;

					return isDataTypeExpressionForArray(dte);
				}
			}
		}
		token = token.parentNode;
	}
	return false;
}

function isDataTypeExpressionForArray(dteToken) {
	const dteChild = dteToken.children[0];
	if (dteChild === undefined)
		return false;

	return dteChild.type === ParseTreeTokenType.CONTAINER_TYPE &&
	dteChild.val.toLowerCase() === 'array';
}

function isDeclarationMatchingVariableName(variableName) {
	return function(declarationToken) {
		const first = declarationToken.children[0];
		if (first === undefined)
			return false;
		if (first.type === ParseTreeTokenType.IDENTIFIER) {
			return first.val.toLowerCase() === variableName;
		}
		else if (first.type === ParseTreeTokenType.COMMA_LIST) {
			for (const child of first.children) {
				if (child.type === ParseTreeTokenType.IDENTIFIER &&
				child.val.toLowerCase() === variableName)
					return true;
			}
			return false;
		}
	};
}

function isArrayDeclaration(declaration) {
	const dte = declaration.children.filter(c => c.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)[0];
	if (dte === undefined)
		return false;

	return isDataTypeExpressionForArray(dte);
}

function mightDeclarationBeAppplicableTo(token) {
	const interestingTypes = new Set([
		ParseTreeTokenType.CODE_BLOCK,
		ParseTreeTokenType.FUNCTION,
		ParseTreeTokenType.PROCEDURE
	]);
	const codeBlocks = new Set();
	let tok = token;
	while (tok !== null) {
		if (interestingTypes.has(tok.type))
			codeBlocks.add(tok);

		tok = tok.parentNode;
	}
	return function(declaration) {
		const closestCodeBlock = getClosestOfType(declaration, interestingTypes);
		return codeBlocks.has(closestCodeBlock);
	};
}

export function isLikelyArrayVariableReference(token, variableName) {
	variableName = variableName.toLowerCase();
	if (isArrayParameter(token, variableName))
		return true;

	// look for any variable or constant declarations.
	// see if any match variableName.
	const root = getTreeRoot(token);
	let declarations = getDescendentsOfTypes(root, [
		ParseTreeTokenType.CONST,
		ParseTreeTokenType.VAR
	]).filter(isDeclarationMatchingVariableName(variableName));
	if (declarations.length > 1) {
		// try to narrow the declarations to ones applicable.
		const narrowedDeclarations = declarations.filter(mightDeclarationBeAppplicableTo(token));

		// We want at least 1 declaration because at least 1 
		// should be applicable for valid Turing code.
		if (narrowedDeclarations.length !== 0)
			declarations = narrowedDeclarations;
	}
	return declarations.some(isArrayDeclaration);
};