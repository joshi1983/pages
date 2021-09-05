import { color } from './color.js';
import { background } from './background.js';
import { loadImage } from './loadImage.js';
import { println } from './println.js';
import { str } from './str.js';

const specials = new Map();

[background, color, loadImage, println, str].forEach(function(f) {
	specials.set(f.name, f);
});

export function processSpecialMethodCall(token, result, settings) {
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