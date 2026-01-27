import { ArrayUtils } from '../../ArrayUtils.js';
import { Shot } from './Shot.js';

export const shots = [];
const maxZ = 20;

export class Shots {
	static render(context2D, width, height, viewpoint) {
		for (const shot of shots) {
			shot.render(context2D, width, height, viewpoint);
		}
	}

	static reset() {
		shots.length = 0;
	}

	static shoot(x, y) {
		shots.push(new Shot(x, y));
	}
	
	static simulateTime(delta) {
		const toRemoveSet = new Set();
		for (const shot of shots) {
			shot.simulateTime(delta);
			if (shot.z > maxZ)
				toRemoveSet.add(shot);
		}
		ArrayUtils.remove(shots, function(s) {
			return !toRemoveSet.has(s);
		});
	}
};