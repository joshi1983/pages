import { flatten } from '../../../../../generic-parsing-utilities/flatten.js';
import { getIdentifierStringsFromTemplateLiteral } from
'../helpers/getIdentifierStringsFromTemplateLiteral.js';
import { getIdentifierStringsFromToken } from './unused-identifiers/getIdentifierStringsFromToken.js';
import { getTokensByTypes } from '../../../../../parse-tree-analysis/cached-parse-tree/getTokensByTypes.js';
import { isFromExportStatement } from './unused-identifiers/isFromExportStatement.js';
import { isFunctionCallingItself } from './unused-identifiers/isFunctionCallingItself.js';
import { mightBeReading } from './unused-identifiers/mightBeReading.js';
import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { SetUtils } from '../../../../../../SetUtils.js';

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
		}
	}
};