import { addInstructionsForSpecialCommand } from
'./addInstructionsForSpecialCommand.js';
import { BinaryOperatorInstruction } from
'../execution/instructions/BinaryOperatorInstruction.js';
import { CallProcedureInstruction } from
'../execution/instructions/CallProcedureInstruction.js';
import { createCallCommandInstruction } from
'./createCallCommandInstruction.js';
import { Command } from '../Command.js';
import { compileDataListLiteral } from './compileDataListLiteral.js';
import { evaluateStringLiteralVal } from
'../parse-tree-analysis/evaluateStringLiteralVal.js';
import { PushInstruction } from '../execution/instructions/PushInstruction.js';
import { ParseTreeToken } from '../ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { shouldValueBeCloned } from './shouldValueBeCloned.js';
import { UnaryOperatorInstruction } from
'../execution/instructions/UnaryOperatorInstruction.js';
import { VariableReadInstruction } from
'../execution/instructions/VariableReadInstruction.js';
await Command.asyncInit();

function mustBeLowerCase(token) {
	if (token.type !== ParseTreeTokenType.STRING_LITERAL || typeof token.val !== 'string' ||
	token.parentNode === null || token.parentNode.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const info = Command.getCommandInfo(token.parentNode.val);
	if (info === undefined)
		return false;
	const childIndex = token.parentNode.children.indexOf(token);
	if (childIndex === 0 && ['localmake', 'make'].indexOf(info.primaryName) !== -1)
		return true;
	return info.args.length > childIndex && info.args[childIndex].refTypes !== undefined;
}

export function getInstructionsFromToken(token, procedures, result, logger) {
	if (!(token instanceof ParseTreeToken))
		throw new Error('getInstructionsFromToken requires a token.  token = ' + token);
	if (!(procedures instanceof Map))
		throw new Error('procedures must be a Map');
	if (!(result instanceof Array))
		throw new Error('result must be an Array');

	if (token.type === ParseTreeTokenType.STRING_LITERAL ||
	token.type === ParseTreeTokenType.LONG_STRING_LITERAL ||
	token.type === ParseTreeTokenType.NUMBER_LITERAL ||
	token.type === ParseTreeTokenType.BOOLEAN_LITERAL) {
		let val = token.val;
		if (token.type === ParseTreeTokenType.LONG_STRING_LITERAL ||
		token.type === ParseTreeTokenType.STRING_LITERAL)
			val = evaluateStringLiteralVal(token.val);
		if (mustBeLowerCase(token))
			val = val.toLowerCase();
		result.push(new PushInstruction(val, token, shouldValueBeCloned(val)));
	}
	else if (token.type === ParseTreeTokenType.VARIABLE_READ)
		result.push(new VariableReadInstruction(token.val.toLowerCase(), token));
	else if (token.type === ParseTreeTokenType.UNARY_OPERATOR) {
		pushParameters(token.children, procedures, result, logger);
		result.push(new UnaryOperatorInstruction(token.val, token));
	}
	else if (token.type === ParseTreeTokenType.BINARY_OPERATOR) {
		pushParameters(token.children, procedures, result, logger);
		if (token.children.length === 2)
			result.push(new BinaryOperatorInstruction(token.val, token));
		else
			throw new Error('2 children required for binary operator but got ' + token.children.length);
	}
	else if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const commandInfo = Command.getCommandInfo(token.val);
		if (!addInstructionsForSpecialCommand(token, commandInfo, procedures, result, logger)) {
			pushParameters(token.children, procedures, result, logger);
			if (commandInfo !== undefined)
				result.push(createCallCommandInstruction(commandInfo, token, token.children.length));
			else {
				result.push(new CallProcedureInstruction(procedures.get(token.val.toLowerCase()), token));
			}
		}
	}
	else if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION && token.children.length === 3) {
		getInstructionsFromToken(token.children[1], procedures, result, logger);
	}
	else if (token.type === ParseTreeTokenType.LIST) {
		compileDataListLiteral(token, procedures, result);
	}
	else {
		const msg = 'Unable to get instructions for token type: ' + ParseTreeTokenType.getNameFor(token.type) + ' and children length ' + token.children.length;
		console.error(msg);
		throw new Error(msg);
	}
};

export function pushParameters(tokens, procedures, instructionsResult, logger) {
	if (!(procedures instanceof Map))
		throw new Error('pushParameters requires a Map for procedures');

	for (var i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (typeof token !== 'object')
			throw new Error('Invalid token at index ' + i + ', token = ' + token);

		getInstructionsFromToken(token, procedures, instructionsResult, logger);
	}
};
