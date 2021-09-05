import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { validateBinaryOperator } from './validateBinaryOperator.js';
import { validateCodeBlock } from './validateCodeBlock.js';
import { validateComma } from './validateComma.js';
import { validateDim } from './validateDim.js';
import { validateDot } from './validateDot.js';
import { validateExit } from './validateExit.js';
import { validateFor } from './validateFor.js';
import { validateFunctionCalls } from './validateFunctionCalls.js';
import { validateIf } from './validateIf.js';
import { validateLoopWhile } from './validateLoopWhile.js';
import { validateNext } from './validateNext.js';
import { validateSemicolon } from './validateSemicolon.js';
import { validateStep } from './validateStep.js';
import { validateTreeRoot } from './validateTreeRoot.js';
import { validateTupleLiteral } from './validateTupleLiteral.js';
import { validateUnaryOperator } from './validateUnaryOperator.js';
import { validateUnmatched } from './validateUnmatched.js';
import { validateWend } from './validateWend.js';

const validators = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, validateBinaryOperator],
	[ParseTreeTokenType.CODE_BLOCK, validateCodeBlock],
	[ParseTreeTokenType.COMMA, validateComma],
	[ParseTreeTokenType.DIM, validateDim],
	[ParseTreeTokenType.DOT, validateDot],
	[ParseTreeTokenType.EXIT, validateExit],
	[ParseTreeTokenType.FOR, validateFor],
	[ParseTreeTokenType.FUNCTION_CALL, validateFunctionCalls],
	[ParseTreeTokenType.IF, validateIf],
	[ParseTreeTokenType.LOOP_WHILE, validateLoopWhile],
	[ParseTreeTokenType.NEXT, validateNext],
	[ParseTreeTokenType.SEMICOLON, validateSemicolon],
	[ParseTreeTokenType.STEP, validateStep],
	[ParseTreeTokenType.TREE_ROOT, validateTreeRoot],
	[ParseTreeTokenType.TUPLE_LITERAL, validateTupleLiteral],
	[ParseTreeTokenType.UNARY_OPERATOR, validateUnaryOperator],
	[ParseTreeTokenType.UNMATCHED, validateUnmatched],
	[ParseTreeTokenType.WEND, validateWend],
]);

export function validateToken(token, parseLogger) {
	const validator = validators.get(token.type);
	if (validator !== undefined)
		validator(token, parseLogger);
};