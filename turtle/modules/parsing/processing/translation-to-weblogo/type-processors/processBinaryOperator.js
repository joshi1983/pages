import { Operators } from
'../../Operators.js';
import { processSpecialBinaryOperator } from
'./operators/processSpecialBinaryOperator.js';
import { processToken } from './processToken.js';

const replacements = Operators.createReplacementsMap();

function processingToWebLogoOperator(symbol) {
	const result = replacements.get(symbol);
	if (result !== undefined)
		return result;
	return symbol;
}

export function processBinaryOperator(token, result, settings) {
	if (typeof settings !== 'object')
		throw new Error(`settings must be an object but got ${settings}`);
	const children = token.children;
	if (children.length === 2) {
		if (processSpecialBinaryOperator(token, result, settings))
			return;
		const info = Operators.getOperatorInfo(token.val);
		let symbol = info.toProc === undefined ? info.toCommand : info.toProc;
		if (symbol !== undefined) {
			result.append(` ${symbol} `);
			for (const operandToken of children) {
				processToken(operandToken, result, settings);
				result.append(' ');
			}
		}
		else {
			processToken(children[0], result, settings);
			result.append(' ' + processingToWebLogoOperator(token.val) + ' ');
			processToken(children[1], result, settings);
		}
	}
	else if (children.length === 1) {
		processToken(children[0], result, settings);
		result.append(' ' + token.val + ' ');
		result.append('; Translation incomplete because\n');
		result.append('; the expression containing operator ' + token.val + '\n');
		result.append('; appeared incomplete in the input code\n');
	}
};