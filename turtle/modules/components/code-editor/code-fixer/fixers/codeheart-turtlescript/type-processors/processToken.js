import { declaringTypes } from '../../../../../../parsing/js-parsing/parsing/declaringTypes.js';
import { noop } from
'../../../../../../noop.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
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

const processors = new Map([
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processAssignmentOperator],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.CODE_BLOCK, processCodeBlock],
	[ParseTreeTokenType.CURLY_BRACKET_EXPRESSION, processCurlyBracketExpression],
	[ParseTreeTokenType.DEFAULT, processDefault],
	[ParseTreeTokenType.DO, processDo],
	[ParseTreeTokenType.FOR, processFor],
	[ParseTreeTokenType.FUNCTION, processFunction],
	[ParseTreeTokenType.FUNCTION_CALL, processFunctionCall],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.IF, processIf],
	[ParseTreeTokenType.RETURN, processReturn],
	[ParseTreeTokenType.SEMICOLON, noop],
	[ParseTreeTokenType.STRING_LITERAL, processStringLiteral],
	[ParseTreeTokenType.SWITCH, processSwitch],
	[ParseTreeTokenType.TEMPLATE_LITERAL, processTemplateLiteral],
	[ParseTreeTokenType.TREE_ROOT, processTreeRoot],
	[ParseTreeTokenType.UNARY_OPERATOR, processUnaryOperator],
	[ParseTreeTokenType.WHILE, processWhile]
]);
for (const f of declaringTypes) {
	processors.set(f, processDeclaration);
}

export function processToken(token, result) {
	const processor = processors.get(token.type);
	if (processor !== undefined)
		processor(token, result);
	else {
		processInGeneral(token, result);
	}
};