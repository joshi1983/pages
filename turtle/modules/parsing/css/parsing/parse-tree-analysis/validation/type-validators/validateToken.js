import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';
import { validateArgList } from './validateArgList.js';
import { validateAttributeSelector } from './validateAttributeSelector.js';
import { validateBinaryOperator } from './validateBinaryOperator.js';
import { validateBlock } from './validateBlock.js';
import { validateDeclaration } from './validateDeclaration.js';
import { validateFunctionCall } from './validateFunctionCall.js';
import { validateNoChildToken } from './validateNoChildToken.js';
import { validateRuleSet } from './validateRuleSet.js';
import { validateSelector } from './validateSelector.js';
import { validateUnmatched } from './validateUnmatched.js';
import { validateValueToken } from './validateValueToken.js';

const validators = new Map([
	[ParseTreeTokenType.ARG_LIST, validateArgList],
	[ParseTreeTokenType.ATTRIBUTE_SELECTOR, validateAttributeSelector],
	[ParseTreeTokenType.BINARY_OPERATOR, validateBinaryOperator],
	[ParseTreeTokenType.COMBINATOR, validateNoChildToken],
	[ParseTreeTokenType.COMMA, validateNoChildToken],
	[ParseTreeTokenType.CURLY_LEFT_BRACKET, validateNoChildToken],
	[ParseTreeTokenType.CURLY_RIGHT_BRACKET, validateNoChildToken],
	[ParseTreeTokenType.CURVED_LEFT_BRACKET, validateNoChildToken],
	[ParseTreeTokenType.CURVED_RIGHT_BRACKET, validateNoChildToken],
	[ParseTreeTokenType.DECLARATION, validateDeclaration],
	[ParseTreeTokenType.DECLARATION_BLOCK, validateBlock],
	[ParseTreeTokenType.FUNCTION_CALL, validateFunctionCall],
	[ParseTreeTokenType.RULE_SET, validateRuleSet],
	[ParseTreeTokenType.SELECTOR, validateSelector],
	[ParseTreeTokenType.SEMICOLON, validateNoChildToken],
	[ParseTreeTokenType.UNMATCHED, validateUnmatched],
	[ParseTreeTokenType.VALUE, validateValueToken]
]);

export function validateToken(token, parseLogger) {
	const validator = validators.get(token.type);
	if (validator !== undefined)
		validator(token, parseLogger);
};