import { addClassBodyIfNeeded } from './addClassBodyIfNeeded.js';
import { addCodeBlockIfNeeded } from './addCodeBlockIfNeeded.js';
import { addDataTypeExpressionIfNeeded } from './addDataTypeExpressionIfNeeded.js';
import { addModuleBodyIfNeeded } from './addModuleBodyIfNeeded.js';
import { isCompleteWithNext } from './isCompleteWithNext.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processAssignmentOperator } from
'./processAssignmentOperator.js';
import { processBinaryOperator } from
'./processBinaryOperator.js';
import { processComma } from
'./processComma.js';
import { processCurvedLeftBracket } from './processCurvedLeftBracket.js';
import { processDot } from
'./processDot.js';
import { processElsif } from
'./processElsif.js';
import { processEnd } from
'./processEnd.js';
import { processIdentifier } from
'./processIdentifier.js';
import { processValueLiteral } from './processValueLiteral.js';

const processors = new Map([
	[ParseTreeTokenType.ASSIGNMENT_OPERATOR, processAssignmentOperator],
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.BOOLEAN_LITERAL, processValueLiteral],
	[ParseTreeTokenType.COMMA, processComma],
	[ParseTreeTokenType.CURVED_LEFT_BRACKET, processCurvedLeftBracket],
	[ParseTreeTokenType.DOT, processDot],
	[ParseTreeTokenType.ELSIF, processElsif],
	[ParseTreeTokenType.END, processEnd],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.NUMBER_LITERAL, processValueLiteral],
	[ParseTreeTokenType.STRING_LITERAL, processValueLiteral]
]);

const tokenAdders = [addClassBodyIfNeeded, addCodeBlockIfNeeded, 
	addDataTypeExpressionIfNeeded, addModuleBodyIfNeeded];

export function addToken(prev, next) {
	while (isCompleteWithNext(prev, next))
		prev = prev.parentNode;

	for (const addFunc of tokenAdders)
		prev = addFunc(prev, next);

	const processor = processors.get(next.type);
	if (processor !== undefined) {
		return processor(prev, next);
	}
	prev.appendChild(next);
	return next;
};