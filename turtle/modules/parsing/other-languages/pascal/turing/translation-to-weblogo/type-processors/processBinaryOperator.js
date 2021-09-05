import { Operators } from
'../../Operators.js';
import { processToken } from
'./processToken.js';

export function processBinaryOperator(token, result) {
	const children = token.children;
	if (children.length === 0)
		return;

	let symbol = token.val;
	if (children.length !== 2) {
		result.append(`\n; Review this.\n`);
		result.append(`; Something is most likely wrong about translating the ${symbol} operands.\n`);
	}
	const info = Operators.getOperatorInfo(symbol);
	result.append('(');
	if (info.to !== undefined)
		symbol = info.to;
	else if (info.convertToCommand !== undefined) {
		result.append(' ' + info.convertToCommand + ' ');
		symbol = undefined;
	}
	if (children.length !== 0)
		processToken(children[0], result);

	if (symbol !== undefined)
		result.append(` ${symbol} `);
	else
		result.append(' ');

	if (children[1] !== undefined)
		processToken(children[1], result);
	result.append(')');
};