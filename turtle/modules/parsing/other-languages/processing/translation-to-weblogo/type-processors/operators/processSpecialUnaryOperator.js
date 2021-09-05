import { incrementDecrement } from './incrementDecrement.js';

const specials = new Map([
	['--', incrementDecrement],
	['++', incrementDecrement],
]);

export function processSpecialUnaryOperator(token, result, settings) {
	const f = specials.get(token.val);
	if (f !== undefined) {
		f(...arguments);
		return true;
	}
};