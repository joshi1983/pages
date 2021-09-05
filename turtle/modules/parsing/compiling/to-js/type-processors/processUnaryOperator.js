import { processToken } from './processToken.js';

export function processUnaryOperator(token, result, options) {
	const children = token.children;
	result.append(' ' + token.val);
	if (children.length !== 0) {
		result.append(' ( ');
		processToken(children[0], result, options);
		result.append(' ) ');
	}
};