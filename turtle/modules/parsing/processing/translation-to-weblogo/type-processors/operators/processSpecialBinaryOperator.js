import { plus } from './plus.js';

const specials = new Map([
	['+', plus]
]);

export function processSpecialBinaryOperator(token, result, settings) {
	const f = specials.get(token.val);
	if (f !== undefined) {
		f(...arguments);
		return true;
	}
};