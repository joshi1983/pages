import { Command } from '../../../modules/parsing/Command.js';
import { prefixWrapper } from '../prefixWrapper.js';
await Command.asyncInit();

function validateUnaryObject(unaryInfo, logger) {
	if (typeof unaryInfo !== 'object')
		logger(`Expected unary to be not specified or be an object but got ${unaryInfo}`);
	if (unaryInfo.mayBePrefix !== undefined && typeof unaryInfo.mayBePrefix !== 'boolean')
		logger(`mayBePrefix must be either not specified, be true, or be false.  Not: ${unaryInfo.mayBePrefix}`);
	if (unaryInfo.isAssignment !== undefined && typeof unaryInfo.isAssignment !== 'boolean')
		logger(`isAssignment must be either not specified, be true, or be false.  Not: ${unaryInfo.isAssignment}`);
}

// returns the range as a pair structured: [minimum, maximum].
function getOperandLengthRange(operatorInfo) {
	if (operatorInfo.isNotBinary === true)
		return [1, 1];
	if (operatorInfo.unary === undefined)
		return [2, 2];
	return [1, 2];
}

export function validateOperatorsJSONData(operators, logger) {
	if (!(operators instanceof Array))
		logger(`Expected an Array but got ${operators}`);
	else {
		const operatorSymbols = new Set();
		operators.forEach(function(operatorInfo, index) {
			const plogger = prefixWrapper(`Case ${index}`, logger);
			if (typeof operatorInfo !== 'object')
				plogger(`Expected an object but got ${operatorInfo}`);
			else {
				if (!Number.isInteger(operatorInfo.precedence))
					plogger(`precedence must be an integer but got ${operatorInfo.precedence}`);
				if (typeof operatorInfo.symbol !== 'string')
					plogger(`symbol must be a string but got ${operatorInfo.symbol}`);
				else if (operatorSymbols.has(operatorInfo.symbol))
					plogger(`symbol must be distinct but found a duplicate of ${operatorInfo.symbol}`);
				else
					operatorSymbols.add(operatorInfo.symbol);
				if (operatorInfo.toCommand !== undefined) {
					if (typeof operatorInfo.toCommand !== 'string')
						plogger(`Expected toCommand to either be undefined or be a string but got ${operatorInfo.toCommand}`);
					else {
						const info = Command.getCommandInfo(operatorInfo.toCommand);
						if (info === undefined)
							plogger(`No WebLogo command found from the toCommand string ${operatorInfo.toCommand}`);
						const operandCountRange = getOperandLengthRange(operatorInfo);
						const argCount = info.args.length;
						if (operandCountRange[0] > argCount)
							plogger(`The minimum number of operands for this operator is ${operandCountRange[0]} but ${operatorInfo.toCommand} uses ${argCount}.`);
						if (operandCountRange[1] < argCount)
							plogger(`The maximum number of operands for this operator is ${operandCountRange[1]} but ${operatorInfo.toCommand} uses ${argCount}.`);
					}
				}
				if (operatorInfo.isAssignment !== undefined) {
					if (typeof operatorInfo.isAssignment !== 'boolean')
						plogger(`isAssignment expected to be undefined, true, or false but not ${operatorInfo.isAssignment}`);
					if (operatorInfo.isAssignment === true && operatorInfo.symbol.indexOf('=') === -1)
						plogger(`When isAssignment is true, we expect to find = in the symbol but = was not found in ${operatorInfo.symbol}`);
				}
				if (operatorInfo.unary !== undefined)
					validateUnaryObject(operatorInfo.unary, prefixWrapper(`validateUnaryObject`, plogger));
				if (index > 0 && typeof operators[index - 1] === 'object' && operators[index - 1] !== null && typeof operators[index - 1].symbol === 'string') {
					const prevSymbol = operators[index - 1].symbol;
					if (typeof prevSymbol === 'string' && typeof operatorInfo.symbol === 'string' && prevSymbol.localeCompare(operatorInfo.symbol) >= 0)
						plogger(`operators should be sorted by symbol but found pair out of order with symbols ${prevSymbol} and ${operatorInfo.symbol}`);
				}
				if (operatorInfo.returnType !== undefined) {
					if (typeof operatorInfo.returnType !== 'string')
						plogger(`returnType must either be undefined or a string but got ${operatorInfo.returnType}`);
				}
			}
		});
	}
};