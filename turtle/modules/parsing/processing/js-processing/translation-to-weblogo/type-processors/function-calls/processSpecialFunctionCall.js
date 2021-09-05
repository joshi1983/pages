import { colorMode } from './colorMode.js';
import { ellipseMode } from './ellipseMode.js';

const specials = new Map();

[colorMode, ellipseMode].forEach(function(f) {
	specials.set(f.name, f);
});

export function processSpecialFunctionCall(token, result, settings) {
	const name = token.children[0].val;
	const f = specials.get(name);
	if (f !== undefined) {
		if (typeof f.isApplicable === 'function') {
			const result = f.isApplicable(token, settings);
			if (result !== true)
				return;
		}
		f(...arguments);
		return true;
	}
};