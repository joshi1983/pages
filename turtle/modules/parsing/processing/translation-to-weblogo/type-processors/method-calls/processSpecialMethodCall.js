import { background, isBackgroundApplicable } from './background.js';
import { loadImage } from './loadImage.js';
import { println } from './println.js';

const specials = new Map();

[loadImage, println].forEach(function(f) {
	specials.set(f.name, f);
});

export function processSpecialMethodCall(token, result, settings) {
	if (isBackgroundApplicable(token, settings)) {
		background(...arguments);
		return true;
	}
	const name = token.children[0].val;
	const f = specials.get(name);
	if (f !== undefined) {
		f(...arguments);
		return true;
	}
};