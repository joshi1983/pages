import { genericProcessToken } from
'../../../generic-parsing-utilities/genericProcessToken.js';
import { noop } from
'../../../../noop.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processArgList } from
'./processArgList.js';
import { processAssignmentOperator } from
'./processAssignmentOperator.js';
import { processBinaryOperator } from
'./processBinaryOperator.js';
import { processCodeBlock } from
'./processCodeBlock.js';
import { processCurlyBracketExpression } from
'./processCurlyBracketExpression.js';
import { processDeclaration } from
'./processDeclaration.js';
import { processDefault } from
'./processDefault.js';
import { processDo } from
'./processDo.js';
import { processFor } from
'./processFor.js';
import { processFunction } from
'./processFunction.js';
import { processFunctionCall } from
'./processFunctionCall.js';
import { processIdentifier } from
'./processIdentifier.js';
import { processIf } from
'./processIf.js';
import { processReturn } from
'./processReturn.js';
import { processStringLiteral } from
'./processStringLiteral.js';
import { processSwitch } from
'./processSwitch.js';
import { processTemplateLiteral } from
'./processTemplateLiteral.js';
import { processUnaryOperator } from
'./processUnaryOperator.js';
import { processWhile } from
'./processWhile.js';

// The following processToken_ and processTokenDeligate is defined to work around
// how processToken is defined after processToken.
let processToken_;

function processTokenDeligate() {
	return processToken_(...arguments);
}

const typeProcessors = new Map([
	[ParseTreeTokenType.ARG_LIST, processArgList(processTokenDeligate)],
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processAssignmentOperator(processTokenDeligate)],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator(processTokenDeligate)],
	[ParseTreeTokenType.CODE_BLOCK, processCodeBlock(processTokenDeligate)],
	[ParseTreeTokenType.CURLY_BRACKET_EXPRESSION, processCurlyBracketExpression(processTokenDeligate)],
	[ParseTreeTokenType.DECLARATION, processDeclaration(processTokenDeligate)],
	[ParseTreeTokenType.DEFAULT, processDefault(processTokenDeligate)],
	[ParseTreeTokenType.DO, processDo(processTokenDeligate)],
	[ParseTreeTokenType.FOR, processFor(processTokenDeligate)],
	[ParseTreeTokenType.FUNCTION, processFunction(processTokenDeligate)],
	[ParseTreeTokenType.FUNCTION_CALL, processFunctionCall(processTokenDeligate)],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier(processTokenDeligate)],
	[ParseTreeTokenType.IF, processIf(processTokenDeligate)],
	[ParseTreeTokenType.RETURN, processReturn(processTokenDeligate)],
	[ParseTreeTokenType.SEMICOLON, noop],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
	[ParseTreeTokenType.SWITCH, processSwitch(processTokenDeligate)],
	[ParseTreeTokenType.TEMPLATE_LITERAL, processTemplateLiteral],
	[ParseTreeTokenType.UNARY_OPERATOR, processUnaryOperator(processTokenDeligate)],
	[ParseTreeTokenType.WHILE, processWhile(processTokenDeligate)]
]);

const processTokenGeneric = genericProcessToken(typeProcessors);

export function processToken(token, result, options) {
	if (typeof options !== 'object')
		throw new Error(`options must be an object but found ${options}`);
	if (options.tokenProcessMap !== undefined) {
		const processor = options.tokenProcessMap.get(token);
		if (processor !== undefined)
			return processor(token, result, options);
	}
	if (options.shouldUseCustomProcessTokenForToken !== undefined) {
		if (options.shouldUseCustomProcessTokenForToken(token))
			return options.processToken(token, result, options);
	}
	const processTokensMap = options.processTokensMap;
	if (processTokensMap !== undefined && processTokensMap.has(token)) {
		processTokensMap.get(token)(token, result, options);
		return;
	}
	processTokenGeneric(token, result, options);
};

processToken_ = processToken;