import { ParseTreeToken } from '../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../modules/parsing/ParseTreeTokenType.js';
import { LogoParsingStates } from '../../modules/parsing/LogoParsingStates.js';
await ParseTreeToken.asyncInit();
await LogoParsingStates.asyncInit();

function testCanBeUnaryOperator(logger) {
	const parentToken = new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.CURVED_BRACKET_EXPRESSION);
	const firstBracket = new ParseTreeToken('(', null, 0, 0, ParseTreeTokenType.LEAF);
	parentToken.appendChild(firstBracket);
	const currentToken = new ParseTreeToken('-', null, 0, 1, ParseTreeTokenType.BINARY_OPERATOR);
	const nextToken = new ParseTreeToken('x', null, 0, 3, ParseTreeTokenType.VARIABLE_READ);
	const result = LogoParsingStates.canBeUnaryOperator(parentToken, currentToken, nextToken, ':x');
	if (result !== true)
		logger('Expected true but got ' + result + ' for canBeUnary on parse tree tokens that can be parsed from code such as " (-:x"');
}

function testIsExpectingProcedureEndOrCommand(logger) {
	const toToken = new ParseTreeToken('to', null, 0, 0, ParseTreeTokenType.PROCEDURE_START_KEYWORD);
	const procName = new ParseTreeToken('p', null, 0, 0, ParseTreeTokenType.LEAF);
	const paramList = new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.LIST);
	const instructionList = new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.LIST);
	toToken.appendChild(procName);
	toToken.appendChild(paramList);
	toToken.appendChild(instructionList);
	const listLiteralToken = new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.LIST);
	const openBracket = new ParseTreeToken('[', null, 0, 0, ParseTreeTokenType.LEAF);
	const closeBracket = new ParseTreeToken(']', null, 0, 0, ParseTreeTokenType.LEAF);
	listLiteralToken.appendChild(openBracket);
	listLiteralToken.appendChild(closeBracket);
	instructionList.appendChild(listLiteralToken);
	
	if (LogoParsingStates.isExpectingProcedureEndOrCommand(toToken))
		logger('if the current token is "to", we should not be expecting an end.  We should be expecting the procedure name.');
	if (LogoParsingStates.isExpectingProcedureEndOrCommand(paramList))
		logger('if the current a procedure\'s parameter list, we should not be expecting an end.  We should be expecting parameters or a new line.');
	if (!LogoParsingStates.isExpectingProcedureEndOrCommand(instructionList))
		logger('Expected to be looking for an end or a command');
}

export function testLogoParsingStates(logger) {
	testCanBeUnaryOperator(logger);
	testIsExpectingProcedureEndOrCommand(logger);
}