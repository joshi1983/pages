import { addToken } from './parsing/addToken.js';
import { fixArrayReferenceArgLists } from './parsing/fixArrayReferenceArgLists.js';
import { fixOperatorPrecedence } from './parsing/fixOperatorPrecedence.js';
import { generalReposition } from './parsing/generalReposition.js';
import { getFunctionsMap } from './getFunctionsMap.js';
import { ParseTreeToken } from
'../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { sanitizeTokens } from './scanning/sanitizeTokens.js'
import { scan } from './scanning/scan.js';
import { shouldBecomeIdentifier } from './shouldBecomeIdentifier.js';
import { shouldBecomeLabel } from './shouldBecomeLabel.js';
import { shouldBecomeUnaryOperator } from './shouldBecomeUnaryOperator.js';
import { stringToTokenType } from './stringToTokenType.js';

export function parse(code) {
	let tokens = scan(code);
	sanitizeTokens(tokens);
	const comments = [];
	const statementSeparators = [];
	const root = new ParseTreeToken(null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	let result = root;
	const functionsMap = getFunctionsMap(tokens);
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const pToken = new ParseTreeToken(token.s, token.lineIndex, token.colIndex, stringToTokenType(token.s));
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