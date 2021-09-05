import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { validateCodeBlock } from './validateCodeBlock.js';
import { validateColon } from './validateColon.js';
import { validateComma } from './validateComma.js';
import { validateCurvedBracketExpression } from './validateCurvedBracketExpression.js';
import { validateDecorator } from './validateDecorator.js';
import { validateDictionaryLiteral } from './validateDictionaryLiteral.js';
import { validateDocstring } from './validateDocstring.js';
import { validateElif } from './validateElif.js';
import { validateElse } from './validateElse.js';
import { validateExcept } from './validateExcept.js';
import { validateExpressionDot } from './validateExpressionDot.js';
import { validateFinally } from './validateFinally.js';
import { validateForLoop } from './validateForLoop.js';
import { validateFunctionCall } from './validateFunctionCall.js';
import { validateIfStatement } from './validateIfStatement.js'; 
import { validateListLiteral } from './validateListLiteral.js';
import { validateNumberLiteral } from './validateNumberLiteral.js';
import { validateReturn } from './validateReturn.js';
import { validateStringLiteral } from './validateStringLiteral.js';
import { validateSubscript } from './validateSubscript.js';
import { validateTry } from './validateTry.js';
import { validateTupleLiteral } from './validateTupleLiteral.js';
import { validateUnrecognized } from './validateUnrecognized.js';
import { validateWhileLoop } from './validateWhileLoop.js';
import { validateYield } from './validateYield.js';

const validators = new Map([
	[ParseTreeTokenType.CODE_BLOCK, validateCodeBlock],
	[ParseTreeTokenType.COLON, validateColon],
	[ParseTreeTokenType.COMMA, validateComma],
	[ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, validateCurvedBracketExpression],
	[ParseTreeTokenType.DECORATOR, validateDecorator],
	[ParseTreeTokenType.DICTIONARY_LITERAL, validateDictionaryLiteral],
	[ParseTreeTokenType.DOCSTRING, validateDocstring],
	[ParseTreeTokenType.ELIF, validateElif],
	[ParseTreeTokenType.ELSE, validateElse],
	[ParseTreeTokenType.EXCEPT, validateExcept],
	[ParseTreeTokenType.EXPRESSION_DOT, validateExpressionDot],
	[ParseTreeTokenType.FINALLY, validateFinally],
	[ParseTreeTokenType.FOR_LOOP, validateForLoop],
	[ParseTreeTokenType.FUNCTION_CALL, validateFunctionCall],
	[ParseTreeTokenType.IF_STATEMENT, validateIfStatement],
	[ParseTreeTokenType.LIST_LITERAL, validateListLiteral],
	[ParseTreeTokenType.NUMBER_LITERAL, validateNumberLiteral],
	[ParseTreeTokenType.RETURN, validateReturn],
	[ParseTreeTokenType.STRING_LITERAL, validateStringLiteral],
	[ParseTreeTokenType.SUBSCRIPT, validateSubscript],
	[ParseTreeTokenType.TRY, validateTry],
	[ParseTreeTokenType.TUPLE_LITERAL, validateTupleLiteral],
	[ParseTreeTokenType.UNRECOGNIZED, validateUnrecognized],
	[ParseTreeTokenType.WHILE_LOOP, validateWhileLoop],
	[ParseTreeTokenType.YIELD, validateYield]
]);

export function validateToken(token, parseLogger) {
	const validator = validators.get(token.type);
	if (validator !== undefined)
		validator(token, parseLogger);
	if (token.type !== ParseTreeTokenType.TREE_ROOT &&
	token.parentNode === null)
		parseLogger.error(`parentNode of a ${ParseTreeTokenType.getNameFor(token.type)} should not be null but it is anyway. val=${token.val}`, token);
};