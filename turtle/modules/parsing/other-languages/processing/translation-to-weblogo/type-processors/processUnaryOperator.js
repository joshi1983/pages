import { Operators } from '../../Operators.js';
import { processSpecialUnaryOperator } from './operators/processSpecialUnaryOperator.js';
import { processToken } from './processToken.js';

const replacements = Operators.createReplacementsMap();
Operators.getAll().forEach(function(info) {
	if (info.convertToCommand !== undefined)
		replacements.set(info.symbol, info.convertToCommand);
});

function getOperandToken(operatorToken) {
	if (operatorToken.children.length === 1)
		return operatorToken.children[0];
}

export function processUnaryOperator(token, result, settings) {
	if (processSpecialUnaryOperator(token, result, settings))
		return;
	const operandToken = getOperandToken(token);
	if (operandToken === undefined)
		return;
	let symbol = token.val;
	if (replacements.has(symbol))
		symbol = replacements.get(symbol);
	result.append(` ${symbol}`);
	if (symbol !== '-')
		result.append(' ');
	processToken(operandToken, result, settings);
};