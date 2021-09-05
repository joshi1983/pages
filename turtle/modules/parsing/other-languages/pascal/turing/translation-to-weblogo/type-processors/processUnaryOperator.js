import { Operators } from
'../../Operators.js';
import { processToken } from
'./processToken.js';

export function processUnaryOperator(token, result) {
	const children = token.children;
	if (children.length > 0) {
		let symbol = token.val;
		const info = Operators.getOperatorInfo(symbol);
		if (info !== undefined && info.unary.toCommand !== undefined)
			symbol = info.unary.toCommand;
		const firstChild = children[0];
		result.append(symbol);
		processToken(firstChild, result);
	}
};