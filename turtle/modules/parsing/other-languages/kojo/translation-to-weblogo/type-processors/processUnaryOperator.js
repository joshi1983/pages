import { Operators } from '../../Operators.js';
import { processToken } from './processToken.js';

export function processUnaryOperator(token, result, settings) {
	const children = token.children;
	if (children.length !== 0) {
		const info = Operators.getOperatorInfo(token.val);
		const unary = info.unary;
		let toSymbol = token.val;
		result.append(' ( ');
		if (unary.toCommand !== undefined) {
			toSymbol = unary.toCommand;
		}
		else if (unary.toSymbol !== undefined) {
			toSymbol = unary.toSymbol;
		}
		else if (unary.toProc !== undefined) {
			toSymbol = unary.toProc;
		}
		result.append(`${toSymbol} `);
		processToken(children[0], result, settings);
		result.append(' ) ');
	}
};