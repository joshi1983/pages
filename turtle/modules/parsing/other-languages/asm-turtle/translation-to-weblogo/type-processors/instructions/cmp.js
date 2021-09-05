import { filterOperandValueTokens } from './filterOperandValueTokens.js';
import { processToken } from '../processToken.js';
import { processTokens } from '../processTokens.js';

export function cmp(token, result, settings) {
	result.append(`\nmake "${settings.comparisonRegisterName} sign `);
	const operandValueTokens = filterOperandValueTokens(token.children);
	if (operandValueTokens.length === 2) {
		processToken(operandValueTokens[0], result);
		result.append(' - ');
		processToken(operandValueTokens[1], result);
	}
	else {
		processTokens(operandValueTokens, result, settings);
	}
};