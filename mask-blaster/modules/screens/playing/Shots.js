import { Shot } from './Shot.js';

const shots = [];

export class Shots {
	static shoot() {
		shots.push(new Shot());
	}

	static render(context2D, width, height, viewpoint) {
		for (const shot of shots) {
			shot.render(context2D, width, height, viewpoint);
		}
	}

	static reset() {
		shots.length = 0;
	}
	
	static simulateTime(delta) {
		for (const shot of shots) {
			shot.simulateTime(delta);
		}
	}
};