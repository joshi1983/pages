import { ArrayUtils } from '../../ArrayUtils.js';
import { Mask } from './Mask.js';

const listeners = [];
export const masks = [];

function dispatchMaskMissed() {
	for (const listener of listeners)
		listener();
}

export class Masks {
	static addMaskMissListener(listener) {
		if (typeof listener !== 'function')
			throw new Error(`listener must be a function but found ${listener}`);

		listeners.push(listener);
	}

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
			let remove = false;
			if (mask.z <= 0) {
				remove = true;
				dispatchMaskMissed();
			}
			else if (mask.health <= 0)
				remove = true;
			if (remove)
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