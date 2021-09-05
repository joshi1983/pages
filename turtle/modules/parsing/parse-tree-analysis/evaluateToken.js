/*
evaluateToken is used only for static analysis of code and optimization of compiled instructions.

This is not intended for use in executed code in a loop.  
See the parsing/compiling directory for how the code gets compiled into arrays of LogoInstruction.
*/
import { BinaryOperatorInstruction } from '../execution/instructions/BinaryOperatorInstruction.js';
import { Command } from '../Command.js';
import { DataTypes } from '../data-types/DataTypes.js';
import { getCommandGroups } from '../../command-groups/getCommandGroups.js';
import { Operators } from '../Operators.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { UnaryOperatorInstruction } from '../execution/instructions/UnaryOperatorInstruction.js';
import { validateParameterizedGroup } from './validation/validateArgumentCounts.js';
import { validateUnaryTokenBasics } from './validation/validateUnaryOperatorParameters.js';

const commandGroups = getCommandGroups(undefined);

function isValidBinaryOperatorTokenBasics(token) {
	if (token.children.length !== 2)
		return false;
	const info = Operators.getOperatorInfo(token.val);
	if (info === undefined)
		return false;
	else {
		for (let i = 0; i < 2; i++) {
			const typeString = Operators.getParameterTypes(info, i);
			const types = new DataTypes(typeString);
			if (!types.mayBeCompatibleWith(token.children[i])) {
				return false;
			}
		}
	}
	return true;
}

function evaluateBinaryOperator(binToken, proceduresMap) {
	if (isValidBinaryOperatorTokenBasics(binToken) === false)
		return undefined;
	const childVals = binToken.children.map(t => evaluateToken(t, proceduresMap));
	// both operands must be numbers to have a defined result.
	if (childVals.some(v => v === undefined || v === null))
		return undefined;
	return BinaryOperatorInstruction.evaluate(binToken.val, childVals[0], childVals[1]);
}

function evaluateParameterizedGroup(pgToken, proceduresMap) {
	if (validateParameterizedGroup(pgToken, proceduresMap) !== undefined)
		return undefined;
	const info = Command.getCommandInfo(pgToken.val);
	if (info === undefined)
		return undefined;
	if (info.returnTypes === null)
		return null;
	if (!info.isStaticEvaluationSafe)
		return undefined;
	const childVals = pgToken.children.map(t => evaluateToken(t, proceduresMap));
	if (childVals.some(v => v === undefined || v === null))
		return undefined;
	return commandGroups.get(info.commandGroup)[info.primaryName](...childVals);
}

function evaluateUnaryOperator(uToken, proceduresMap) {
	if (validateUnaryTokenBasics(uToken) !== undefined)
		return undefined;
	const input = evaluateToken(uToken.children[0], proceduresMap);
	if (input === undefined)
		return undefined;
	return UnaryOperatorInstruction.evaluate(uToken.val, input);
}

function evaluateList(listToken, proceduresMap) {
	if (listToken.children.length < 2)
		return undefined;
	const childTokens = listToken.children.slice(1, listToken.children.length - 1);
	const evaluatedElements = childTokens.map(t => evaluateToken(t, proceduresMap));
	if (evaluatedElements.some(v => v === undefined || v === null))
		return undefined;
	return evaluatedElements;
}

// All callers should check for undefined because it indicates the inability to evaluate a constant value corresponding with the token.
export function evaluateToken(token, proceduresMap) {
	if (!(proceduresMap instanceof Map))
		throw new Error('proceduresMap must be a Map');
	if ([ParseTreeTokenType.BOOLEAN_LITERAL, ParseTreeTokenType.LONG_STRING_LITERAL,
	ParseTreeTokenType.STRING_LITERAL, 
	ParseTreeTokenType.NUMBER_LITERAL].indexOf(token.type) !== -1)
		return token.val;
	if (token.type === ParseTreeTokenType.BINARY_OPERATOR)
		return evaluateBinaryOperator(token, proceduresMap);
	if (token.type === ParseTreeTokenType.PARAMETERIZED_GROUP)
		return evaluateParameterizedGroup(token, proceduresMap);
	if (token.type === ParseTreeTokenType.UNARY_OPERATOR)
		return evaluateUnaryOperator(token, proceduresMap);
	if (token.type === ParseTreeTokenType.LIST)
		return evaluateList(token, proceduresMap);
	return undefined; // indicate unable to evaluate right now.
};