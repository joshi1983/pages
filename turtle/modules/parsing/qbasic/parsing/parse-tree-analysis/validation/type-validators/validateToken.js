import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { validateAssignment } from './validateAssignment.js';
import { validateBinaryOperator } from './validateBinaryOperator.js';
import { validateCodeBlock } from './validateCodeBlock.js';
import { validateComma } from './validateComma.js';
import { validateCompositeIdentifier } from './validateCompositeIdentifier.js';
import { validateDim } from './validateDim.js';
import { validateDot } from './validateDot.js';
import { validateEndFunction } from './validateEndFunction.js';
import { validateEndIf } from './validateEndIf.js';
import { validateEndSelect } from './validateEndSelect.js';
import { validateEndSub } from './validateEndSub.js';
import { validateExit } from './validateExit.js';
import { validateFor } from './validateFor.js';
import { validateFunctionCalls } from './validateFunctionCalls.js';
import { validateIf } from './validateIf.js';
import { validateLoopWhile } from './validateLoopWhile.js';
import { validateNext } from './validateNext.js';
import { validateParseTreeBasics } from
'../../../../../generic-parsing-utilities/validateParseTreeBasics.js';
import { validateSelect } from './validateSelect.js';
import { validateSemicolon } from './validateSemicolon.js';
import { validateStep } from './validateStep.js';
import { validateSub } from './validateSub.js';
import { validateTreeRoot } from './validateTreeRoot.js';
import { validateTupleLiteral } from './validateTupleLiteral.js';
import { validateUnaryOperator } from './validateUnaryOperator.js';
import { validateUnmatched } from './validateUnmatched.js';
import { validateWend } from './validateWend.js';

const validators = new Map([
	[ParseTreeTokenType.ASSIGNMENT, validateAssignment],
	[ParseTreeTokenType.BINARY_OPERATOR, validateBinaryOperator],
	[ParseTreeTokenType.CODE_BLOCK, validateCodeBlock],
	[ParseTreeTokenType.COMMA, validateComma],
	[ParseTreeTokenType.COMPOSITE_IDENTIFIER, validateCompositeIdentifier],
	[ParseTreeTokenType.DIM, validateDim],
	[ParseTreeTokenType.DOT, validateDot],
	[ParseTreeTokenType.END_FUNCTION, validateEndFunction],
	[ParseTreeTokenType.END_IF, validateEndIf],
	[ParseTreeTokenType.END_SELECT, validateEndSelect],
	[ParseTreeTokenType.END_SUB, validateEndSub],
	[ParseTreeTokenType.EXIT, validateExit],
	[ParseTreeTokenType.FOR, validateFor],
	[ParseTreeTokenType.FUNCTION_CALL, validateFunctionCalls],
	[ParseTreeTokenType.IF, validateIf],
	[ParseTreeTokenType.LOOP_WHILE, validateLoopWhile],
	[ParseTreeTokenType.NEXT, validateNext],
	[ParseTreeTokenType.SELECT, validateSelect],
	[ParseTreeTokenType.SEMICOLON, validateSemicolon],
	[ParseTreeTokenType.STEP, validateStep],
	[ParseTreeTokenType.SUB, validateSub],
	[ParseTreeTokenType.TREE_ROOT, validateTreeRoot],
	[ParseTreeTokenType.TUPLE_LITERAL, validateTupleLiteral],
	[ParseTreeTokenType.UNARY_OPERATOR, validateUnaryOperator],
	[ParseTreeTokenType.UNMATCHED, validateUnmatched],
	[ParseTreeTokenType.WEND, validateWend],
]);

export function validateToken(token, parseLogger, options) {
	if (typeof options !== 'object')
		throw new Error(`options must be an object but found ${options}`);

	validateParseTreeBasics(token, parseLogger);
	const validator = validators.get(token.type);
	if (validator !== undefined)
		validator(token, parseLogger, options);
};