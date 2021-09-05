import { Operators } from '../Operators.js';
import { processToken } from './processToken.js';

export function processBinaryOperator(token, result, options) {
	let symbol = token.val;
	const info = Operators.getOperatorInfo(symbol);
	if (info !== undefined) {
		if (info.to !== undefined)
			symbol = info.to;
	}
	const children = token.children;
	if (children.length !== 0) {
		result.append(' ( ');
		processToken(children[0], result, options);
		result.append(' ) ');
	}
	result.append(` ${symbol} `);
	if (children.length >= 2) {
		result.append(' ( ');
		processToken(children[1], result, options);
		result.append(' ) ');
	}
};