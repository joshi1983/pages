import { ArrayUtils } from '../../ArrayUtils.js';
import { Explosion } from './Explosion.js';
import { masks } from './Masks.js';
import { pick } from '../../pick.js';
import { Score } from '../../components/Score.js';
import { shots } from './Shots.js';
import { playSound, Sounds } from '../../components/Sounds.js';

export const explosions = [];

export class Explosions {
	static hit(x, y, z, isDud) {
		explosions.push(new Explosion(x, y, z, isDud));
	}
	
	static processCollisions(delta) {
		const toRemoveSet = new Set();
		// look for collisions between masks and shots.
		for (const shot of shots) {
			for (const mask of masks) {
				const info = shot.getCollisionWithMask(mask, delta);
				if (info !== undefined) {
					const isDud = info.maskInfo.redDelta < 0.05; // isDud = collision color is very red.
					Explosions.hit(info.x, info.y, info.z, isDud);
					toRemoveSet.add(shot);
					Score.increment();
					mask.damage();
					playSound(pick([Sounds.EXPLOSION1, Sounds.EXPLOSION2]));
				}
			}
		}
		ArrayUtils.remove(shots, function(shot) {
			return !toRemoveSet.has(shot);
		});
	}

	static render(context2D, width, height, viewpoint) {
		for (const explosion of explosions) {
			explosion.render(context2D, width, height, viewpoint);
		}
	}

	static reset() {
		explosions.length = 0;
	}

	static simulateTime(delta) {
		if (typeof delta !== 'number')
			throw new Error(`delta must be a number but found ${delta}`);

		Explosions.processCollisions(delta);
		const toRemoveSet = new Set();
		for (const explosion of explosions) {
			explosion.simulateTime(delta);

			// remove the almost invisible explosions.
			if (explosion.maxOpacity < 0.1 || explosion.z <= 0) {
				toRemoveSet.add(explosion);
			}
		}
		if (toRemoveSet.size !== 0)
			ArrayUtils.remove(explosions, function(e) {
				return !toRemoveSet.has(e);
			});
	}
};