import { flatten } from
'../../../../../generic-parsing-utilities/flatten.js';
import { getClosestOfType } from
'../../../../../generic-parsing-utilities/getClosestOfType.js';
import { getDescendentsOfType } from
'../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getIdentifierStringsFromTemplateLiteral } from
'../helpers/getIdentifierStringsFromTemplateLiteral.js';
import { getIdentifierStringsFromToken } from './unused-identifiers/getIdentifierStringsFromToken.js';
import { getTokensByTypes } from '../../../../../parse-tree-analysis/cached-parse-tree/getTokensByTypes.js';
import { isFromExportStatement } from './unused-identifiers/isFromExportStatement.js';
import { isFunctionCallingItself } from './unused-identifiers/isFunctionCallingItself.js';
import { mightBeReading } from './unused-identifiers/mightBeReading.js';
import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { SetUtils } from '../../../../../../SetUtils.js';

const declarationTypes = new Set([
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.VAR
]);

function isNotBeingDeclared(token) {
	const parent = token.parentNode;
	if (declarationTypes.has(parent.type))
		return false;

	const grandParent = parent.parentNode;
	if (grandParent === null)
		return true;

	if (parent.type === ParseTreeTokenType.ARG_LIST &&
	grandParent.type === ParseTreeTokenType.FUNCTION)
		return false;

	if (parent.val === '=>' &&
	parent.type === ParseTreeTokenType.BINARY_OPERATOR &&
	parent.children.indexOf(token) === 0)
		return false;

	if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	parent.val === '=' &&
	parent.children.indexOf(token) === 0) {
		if (declarationTypes.has(grandParent))
			return false;
	}
	return true;
}

function isNotUsedInNarrowScope(token, variableName) {
	const nearestCodeBlock = getClosestOfType(token, ParseTreeTokenType.CODE_BLOCK);
	if (nearestCodeBlock === null)
		return false;

	const matchingDescendents = getDescendentsOfType(nearestCodeBlock, ParseTreeTokenType.IDENTIFIER).
		filter(t => t.val === variableName && isNotBeingDeclared(t));
	if (matchingDescendents.length === 0) {
		const templateLiterals = getDescendentsOfType(nearestCodeBlock, ParseTreeTokenType.TEMPLATE_LITERAL);
		for (const templateLiteral of templateLiterals) {
			const identifiers = getIdentifierStringsFromTemplateLiteral(templateLiteral.val);
			if (identifiers.indexOf(variableName) !== -1)
				return false;
		}
		return true;
	}
	return false;
}

export function validateUnusedIdentifiers(cachedParseTree, parseLogger) {
	const declareTokens = getTokensByTypes(cachedParseTree, [
		ParseTreeTokenType.CLASS, ParseTreeTokenType.CONST, ParseTreeTokenType.LET, ParseTreeTokenType.VAR,
		ParseTreeTokenType.FUNCTION, ParseTreeTokenType.IMPORT
	]).filter(t => !isFromExportStatement(t));
	const allTokens = flatten(cachedParseTree.root);
	const idTokens = allTokens.filter(t => t.type === ParseTreeTokenType.IDENTIFIER).
		filter(t => mightBeReading(t) && !isFunctionCallingItself(t));
	const templateTokens = allTokens.filter(t => t.type === ParseTreeTokenType.TEMPLATE_LITERAL);
	const readIDValues = new Set(idTokens.map(tok => tok.val));
	for (const templateToken of templateTokens) {
		SetUtils.addAll(readIDValues, getIdentifierStringsFromTemplateLiteral(templateToken.val));
	}
	for (const token of declareTokens) {
		const identifierStrings = getIdentifierStringsFromToken(token);
		for (const idVal of identifierStrings) {
			if (!readIDValues.has(idVal))
				parseLogger.error(`The identifier ${idVal} is never used.`, token);
			else if (isNotUsedInNarrowScope(token, idVal)) {
				parseLogger.error(`The identifier ${idVal} is never used in its narrow scope.`, token);
			}
		}
	}
};