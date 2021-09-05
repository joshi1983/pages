import { processToken } from './processToken.js';

export function processUnaryOperator(token, result) {
	const children = token.children;
	result.append(' ' + token.val);
	if (children.length !== 0) {
		result.append(' ( ');
		processToken(children[0], result);
		result.append(' ) ');
	}
};