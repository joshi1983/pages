import { clamp } from '../clamp.js';

export class AnimationCommands {
	constructor(settings) {
		this.settings = settings;
	}

	animation_clampedTimeRatio() {
		return clamp(this.settings.animationTime / this.settings.animationDurationSeconds, 0, 1);
	}

	animation_duration() {
		return this.settings.animationDurationSeconds;
	}

	animation_time() {
		return this.settings.animationTime;
	}
	
	animation_timeRatio() {
		return this.settings.animationTime / this.settings.animationDurationSeconds;
	}
};