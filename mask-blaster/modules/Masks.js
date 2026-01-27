import { Mask } from './components/Mask.js';

const masks = [];

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
		const toRemove = [];
		for (const mask of masks) {
			mask.simulateTime(delta);
		}
		let numToRemove;
		for (numToRemove = 0; numToRemove < masks.length; numToRemove++) {
			if (masks[numToRemove].z > 0) {
				break;
			}
		}
		masks.splice(0, numToRemove);
		for (let i = 0; i < numToRemove; i++) {
			masks.push(new Mask());
		}
	}
};