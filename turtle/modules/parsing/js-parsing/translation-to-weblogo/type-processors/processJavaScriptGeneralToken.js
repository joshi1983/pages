import { declaringTypes } from '../../parsing/declaringTypes.js';
import { noop } from
'../../../../noop.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processArgList } from './processArgList.js';
import { processAssignmentOperator } from './processAssignmentOperator.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processCodeBlock } from './processCodeBlock.js';
import { processCurlyBracketExpression } from './processCurlyBracketExpression.js';
import { processDeclaration } from './processDeclaration.js';
import { processDefault } from './processDefault.js';
import { processDo } from './processDo.js';
import { processFor } from './processFor.js';
import { processFunction } from './processFunction.js';
import { processFunctionCall } from './processFunctionCall.js';
import { processIdentifier } from './processIdentifier.js';
import { processIf } from './processIf.js';
import { processInGeneral } from './processInGeneral.js';
import { processReturn } from './processReturn.js';
import { processStringLiteral } from './processStringLiteral.js';
import { processSwitch } from './processSwitch.js';
import { processTemplateLiteral } from './processTemplateLiteral.js';
import { processTreeRoot } from './processTreeRoot.js';
import { processUnaryOperator } from './processUnaryOperator.js';
import { processWhile } from './processWhile.js';

function getProcessorsFor(processToken) {
	const processors = new Map([
		[ParseTreeTokenType.ARG_LIST, processArgList(processToken)],
		[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processAssignmentOperator(processToken)],
		[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator(processToken)],
		[ParseTreeTokenType.CODE_BLOCK, processCodeBlock(processToken)],
		[ParseTreeTokenType.CURLY_BRACKET_EXPRESSION, processCurlyBracketExpression(processToken)],
		[ParseTreeTokenType.DEFAULT, processDefault(processToken)],
		[ParseTreeTokenType.DO, processDo(processToken)],
		[ParseTreeTokenType.FOR, processFor(processToken)],
		[ParseTreeTokenType.FUNCTION, processFunction(processToken)],
		[ParseTreeTokenType.FUNCTION_CALL, processFunctionCall(processToken)],
		[ParseTreeTokenType.IDENTIFIER, processIdentifier(processToken)],
		[ParseTreeTokenType.IF, processIf(processToken)],
		[ParseTreeTokenType.RETURN, processReturn(processToken)],
		[ParseTreeTokenType.SEMICOLON, noop],
		[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
		[ParseTreeTokenType.SWITCH, processSwitch(processToken)],
		[ParseTreeTokenType.TEMPLATE_LITERAL, processTemplateLiteral],
		[ParseTreeTokenType.TREE_ROOT, processTreeRoot(processToken)],
		[ParseTreeTokenType.UNARY_OPERATOR, processUnaryOperator(processToken)],
		[ParseTreeTokenType.WHILE, processWhile(processToken)]
	]);
	for (const f of declaringTypes) {
		processors.set(f, processDeclaration(processToken));
	}
	return processors;
}

export function processJavaScriptGeneralToken(processToken) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken expected to be a function but got ${processToken}`);
	const processors = getProcessorsFor(processToken);
	const processInGeneralConcrete = processInGeneral(processToken);
	return function(token, result, settings) {
		const processor = processors.get(token.type);
		if (processor !== undefined)
			processor(token, result, settings);
		else {
			processInGeneralConcrete(token, result, settings);
		}
	};
};