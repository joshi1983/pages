import { ArrayUtils } from '../../ArrayUtils.js';
import { Mask } from './Mask.js';

export const masks = [];

export class Masks {
	static render(context2d, width, height, viewpoint) {
		for (const mask of masks) {
			mask.render(context2d, width, height, viewpoint);
		}
	}

	static reset() {
		masks.length = 1;
		masks[0] = new Mask();
	}

	static simulateTime(delta) {
		const toRemoveSet = new Set();
		for (const mask of masks) {
			mask.simulateTime(delta);
			if (mask.health <= 0 || mask.z <= 0)
				toRemoveSet.add(mask);
		}
		if (toRemoveSet.size !== 0)
			ArrayUtils.remove(masks, function(m) {
				return !toRemoveSet.has(m);
			});
		if (masks.length === 0)
			masks.push(new Mask());
	}
};