import { isValueStackPop } from './token-classifiers/isValueStackPop.js';

export function getDecreaseAmountFromToken(token) {
	if (isValueStackPop(token))
		return 1;
	if (token.children.length === 2) {
		if (token.val === '-=')
			return parseInt(token.children[1].val);
		else if (token.val === '+=')
			return -parseInt(token.children[1].val);
	}
	return 1;
};