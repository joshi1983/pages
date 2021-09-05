import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { validateCase } from './validateCase.js';
import { validateCodeBlock } from './validateCodeBlock.js';
import { validateColon } from './validateColon.js';
import { validateComma } from './validateComma.js';
import { validateConditionalTernary } from './validateConditionalTernary.js';
import { validateDot } from './validateDot.js';
import { validateElse } from './validateElse.js';
import { validateEnd } from './validateEnd.js';
import { validateExpressionIndexExpression } from './validateExpressionIndexExpression.js';
import { validateInstructionList } from './validateInstructionList.js';
import { validateKeyValuePair } from './validateKeyValuePair.js';
import { validateLocalOrDeclare } from './validateLocalOrDeclare.js';
import { validateMixed } from './validateMixed.js';
import { validateParseTreeBasics } from
'../../../../../generic-parsing-utilities/validateParseTreeBasics.js';
import { validateUnmatched } from './validateUnmatched.js';
import { validateVectorExpression } from './validateVectorExpression.js';

const validators = new Map([
	[ParseTreeTokenType.CASE, validateCase],
	[ParseTreeTokenType.CODE_BLOCK, validateCodeBlock],
	[ParseTreeTokenType.COLON, validateColon],
	[ParseTreeTokenType.COMMA, validateComma],
	[ParseTreeTokenType.CONDITIONAL_TERNARY, validateConditionalTernary],
	[ParseTreeTokenType.DECLARE, validateLocalOrDeclare],
	[ParseTreeTokenType.DOT, validateDot],
	[ParseTreeTokenType.ELSE, validateElse],
	[ParseTreeTokenType.END, validateEnd],
	[ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION, validateExpressionIndexExpression],
	[ParseTreeTokenType.INSTRUCTION_LIST, validateInstructionList],
	[ParseTreeTokenType.KEY_VALUE_PAIR, validateKeyValuePair],
	[ParseTreeTokenType.LOCAL, validateLocalOrDeclare],
	[ParseTreeTokenType.MIXED, validateMixed],
	[ParseTreeTokenType.UNMATCHED, validateUnmatched],
	[ParseTreeTokenType.VECTOR_EXPRESSION, validateVectorExpression],
]);

export function validateToken(token, parseLogger) {
	validateParseTreeBasics(token, parseLogger);
	const validator = validators.get(token.type);
	if (validator !== undefined)
		validator(token, parseLogger);
};