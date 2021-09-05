import { isStringToken } from './helpers/isStringToken.js';
import { processToken } from './processToken.js';
import { processTokens } from './helpers/processTokens.js';
import { QBasicOperators } from '../../QBasicOperators.js';

function processPlusOperator(token, result) {
	const children = token.children;
	const first = children[0];
	const last = children[1];
	if (isStringToken(first) || isStringToken(last)) {
		result.append(' word ');
		processToken(first, result);
		result.append(' ');
		processToken(last, result);
	}
	else {
		processToken(first, result);
		result.append(' + ');
		processToken(last, result);
	}
}

const processors = new Map([
	['+', processPlusOperator]
]);

export function processBinaryOperator(token, result) {
	const info = QBasicOperators.getOperatorInfo(token.val);
	const children = token.children;
	const lastChild = children[children.length - 1];
	const processor = processors.get(info.symbol);
	if (children.length === 2 && processor !== undefined) {
		processor(token, result);
		return;
	}
	if (info.to !== undefined) {
		if (children.length === 2)
			processToken(children[0], result);
		result.append(` ${info.to} `);
		if (lastChild !== undefined)
			processToken(lastChild, result);
	}
	else if (info.toCommand !== undefined) {
		result.append(` ${info.toCommand} `);
		processTokens(children, result);
	}
};