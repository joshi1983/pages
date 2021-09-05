import { addCodeBlockIfNeeded } from './parsing/addCodeBlockIfNeeded.js';
import { addToken } from './parsing/addToken.js';
import { adjustToken } from './parsing/adjustToken.js';
import { fixOperatorPrecedence } from './parsing/fixOperatorPrecedence.js';
import { isComment } from './scanning/isComment.js';
import { ParseTreeToken } from '../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { processBreak } from './parsing/processBreak.js';
import { processCase } from './parsing/processCase.js';
import { processCatch } from './parsing/processCatch.js';
import { processClass } from './parsing/processClass.js';
import { processColon } from './parsing/processColon.js';
import { processComma } from './parsing/processComma.js';
import { processCurlyLeftBracket } from './parsing/processCurlyLeftBracket.js';
import { processCurlyRightBracket } from './parsing/processCurlyRightBracket.js';
import { processCurvedLeftBracket } from './parsing/processCurvedLeftBracket.js';
import { processCurvedRightBracket } from './parsing/processCurvedRightBracket.js';
import { processDataType } from './parsing/processDataType.js';
import { processDefault } from './parsing/processDefault.js';
import { processDot } from './parsing/processDot.js';
import { processElse } from './parsing/processElse.js';
import { processFinally } from './parsing/processFinally.js';
import { processFor } from './parsing/processFor.js';
import { processIdentifier } from './parsing/processIdentifier.js';
import { processIf } from './parsing/processIf.js';
import { processOperator } from './parsing/processOperator.js';
import { processQuestionMark } from './parsing/processQuestionMark.js';
import { processSemicolon } from './parsing/processSemicolon.js';
import { processSquareLeftBracket } from './parsing/processSquareLeftBracket.js';
import { processSquareRightBracket } from './parsing/processSquareRightBracket.js';
import { scan } from './scanning/scan.js';
import { scanTokenToParseTreeToken } from './scanTokenToParseTreeToken.js';
import { shouldAppendChild } from './parsing/shouldAppendChild.js';

const tokenTypeProcessorsMap = new Map([
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processOperator],
	[ParseTreeTokenType.BINARY_OPERATOR, processOperator],
	[ParseTreeTokenType.BREAK, processBreak],
	[ParseTreeTokenType.CASE, processCase],
	[ParseTreeTokenType.CATCH, processCatch],
	[ParseTreeTokenType.CLASS, processClass],
	[ParseTreeTokenType.COLON, processColon],
	[ParseTreeTokenType.COMMA, processComma],
	[ParseTreeTokenType.CURLY_LEFT_BRACKET, processCurlyLeftBracket],
	[ParseTreeTokenType.CURLY_RIGHT_BRACKET, processCurlyRightBracket],
	[ParseTreeTokenType.CURVED_LEFT_BRACKET, processCurvedLeftBracket],
	[ParseTreeTokenType.CURVED_RIGHT_BRACKET, processCurvedRightBracket],
	[ParseTreeTokenType.DATA_TYPE, processDataType],
	[ParseTreeTokenType.DEFAULT, processDefault],
	[ParseTreeTokenType.DOT, processDot],
	[ParseTreeTokenType.ELSE, processElse],
	[ParseTreeTokenType.FINALLY, processFinally],
	[ParseTreeTokenType.FOR, processFor],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.QUESTION_MARK, processQuestionMark],
	[ParseTreeTokenType.SEMICOLON, processSemicolon],
	[ParseTreeTokenType.SQUARE_LEFT_BRACKET, processSquareLeftBracket],
	[ParseTreeTokenType.SQUARE_RIGHT_BRACKET, processSquareRightBracket],
	[ParseTreeTokenType.UNARY_OPERATOR, processOperator],
]);

export function parse(code) {
	if (typeof code !== 'string')
		throw new Error(`code must be a string.  Not: ${code}`);
	const tokens = scan(code);
	const comments = tokens.filter(isComment).map(scanTokenToParseTreeToken);
	const nonCommentTokens = tokens.filter(t => !isComment(t));
	const result = new ParseTreeToken(null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	let token = result;
	for (let i = 0; i < nonCommentTokens.length; i++) {
		const tok = scanTokenToParseTreeToken(nonCommentTokens[i]);
		const processor = tokenTypeProcessorsMap.get(tok.type);
		if (processor !== undefined) {
			const resultToken = processor(token, tok);
			if (resultToken === undefined)
				token = tok;
			else
				token = resultToken;
		}
		else {
			if (!addCodeBlockIfNeeded(token, tok)) {
				while (token.type !== ParseTreeTokenType.IMPORT &&
				!shouldAppendChild(token, tok))
					token = token.parentNode;
				addToken(token, tok);
			}
			token = tok;
		}
	}
	adjustToken(token);
	fixOperatorPrecedence(result);
	return {
		'root': result,
		'comments': comments
	};
};