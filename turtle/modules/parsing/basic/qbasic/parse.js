import { addToken } from './parsing/addToken.js';
import { fixArrayReferenceArgLists } from './parsing/fixArrayReferenceArgLists.js';
import { fixOperatorPrecedence } from './parsing/fixOperatorPrecedence.js';
import { generalReposition } from './parsing/generalReposition.js';
import { getFunctionsMap } from './getFunctionsMap.js';
import { likelyUsesForEachLoop } from './parsing/likelyUsesForEachLoop.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { sanitizeTokens } from './scanning/sanitizeTokens.js'
import { scan } from './scanning/scan.js';
import { shouldBecomeIdentifier } from './shouldBecomeIdentifier.js';
import { shouldBecomeLabel } from './shouldBecomeLabel.js';
import { shouldBecomeUnaryOperator } from './shouldBecomeUnaryOperator.js';
import { shouldBooleanLiteralsBeIdentifiers } from './shouldBooleanLiteralsBeIdentifiers.js';
import { shouldBooleanLiteralBecomeIdentifier } from './shouldBooleanLiteralBecomeIdentifier.js';
import { stringToTokenType } from './stringToTokenType.js';

export function parse(code, parseSettings) {
	let skipScanTokenSanitization = false;
	let parseForEachLoops = false;
	if (parseSettings !== undefined) {
		if (parseSettings.skipScanTokenSanitization !== undefined)
			skipScanTokenSanitization = parseSettings.skipScanTokenSanitization;
		if (parseSettings.parseForEachLoops === true)
			parseForEachLoops = true;
	}
	let tokens = scan(code);
	if (skipScanTokenSanitization !== true)
		sanitizeTokens(tokens);
	const comments = [];
	const statementSeparators = [];
	const root = new ParseTreeToken(null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	let result = root;
	const scanTokensNeverBooleanLiterals = shouldBooleanLiteralsBeIdentifiers(tokens);
	let isPreviousBooleanConverted = false;
	if (parseSettings === undefined)
		parseForEachLoops = likelyUsesForEachLoop(tokens);
	const functionsMap = getFunctionsMap(tokens);
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const pToken = new ParseTreeToken(token.s, token.lineIndex, token.colIndex, stringToTokenType(token.s, parseForEachLoops));
		if (pToken.type === ParseTreeTokenType.BOOLEAN_LITERAL &&
		scanTokensNeverBooleanLiterals)
			pToken.type = ParseTreeTokenType.IDENTIFIER;
		if (shouldBecomeLabel(result, pToken, tokens[i + 1]))
			pToken.type = ParseTreeTokenType.LABEL;
		else if (shouldBecomeUnaryOperator(result, pToken))
			pToken.type = ParseTreeTokenType.UNARY_OPERATOR;
		else if (shouldBecomeIdentifier(result, pToken))
			pToken.type = ParseTreeTokenType.IDENTIFIER;
		result = generalReposition(result, pToken);
		if (pToken.type === ParseTreeTokenType.COMMENT)
			comments.push(pToken);
		else if (pToken.type === ParseTreeTokenType.COLON)
			statementSeparators.push(pToken);
		else {
			result = addToken(result, pToken, functionsMap);
			if (shouldBooleanLiteralBecomeIdentifier(pToken, isPreviousBooleanConverted)) {
				pToken.type = ParseTreeTokenType.IDENTIFIER;
				isPreviousBooleanConverted = true;
			}
		}
	}
	fixArrayReferenceArgLists(root);
	fixOperatorPrecedence(root);
	return {
		'comments': comments,
		'root': root,
		'statementSeparators': statementSeparators
	};
};