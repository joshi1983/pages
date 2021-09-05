import { isStringToken } from './helpers/isStringToken.js';
import { processToken } from './processToken.js';
import { processTokens } from './helpers/processTokens.js';
import { QBasicOperators } from '../../QBasicOperators.js';

function processPlusOperator(token, result, options) {
	const children = token.children;
	const first = children[0];
	const last = children[1];
	if (isStringToken(first) || isStringToken(last)) {
		result.append(' word ');
		processToken(first, result, options);
		result.append(' ');
		processToken(last, result, options);
	}
	else {
		processToken(first, result, options);
		result.append(' + ');
		processToken(last, result, options);
	}
}

const processors = new Map([
	['+', processPlusOperator]
]);

export function processBinaryOperator(token, result, options) {
	const info = QBasicOperators.getOperatorInfo(token.val);
	const children = token.children;
	const lastChild = children[children.length - 1];
	const processor = processors.get(info.symbol);
	if (children.length === 2 && processor !== undefined) {
		processor(token, result, options);
		return;
	}
	if (info.to !== undefined) {
		if (children.length === 2)
			processToken(children[0], result, options);
		result.append(` ${info.to} `);
		if (lastChild !== undefined)
			processToken(lastChild, result, options);
	}
	else if (info.convertToCommand !== undefined) {
		result.append(` ${info.convertToCommand} `);
		processTokens(children, result, options);
	}
};